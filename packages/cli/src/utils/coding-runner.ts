import {readFileSync, writeFileSync, renameSync, mkdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join} from 'node:path';

import {getPreferences} from '@/config/preferences';
import type {CliBackendConfig} from '@/types/config';
import {getSession} from '@/utils/coding-sessions';
import {ptyManager} from '@/server/pty/manager';

export function getAgentConfig(agentName: string): CliBackendConfig | null {
	const prefs = getPreferences();
	const coding = prefs.coding as Record<string, CliBackendConfig> | undefined;
	if (!coding || !coding[agentName]) {
		return null;
	}
	return coding[agentName];
}

/**
 * Build CLI args for starting an agent's interactive TUI. If `prompt` is
 * provided, it's appended as the final positional arg so the agent processes
 * it on startup; otherwise the TUI launches blank (used by the xterm spawn
 * path). Session id flows through `sessionArg` when the agent supports it.
 */
export function buildStartArgs(
	config: CliBackendConfig,
	params: {
		prompt?: string;
		sessionId: string;
		model?: string;
		systemPrompt?: string;
	},
): string[] {
	const args = [...(config.args || [])];

	if (config.sessionArg && config.sessionMode === 'always') {
		args.push(config.sessionArg, params.sessionId);
	}

	if (config.allowedTools && config.allowedTools.length > 0) {
		for (const tool of config.allowedTools) {
			args.push('--allowedTools', tool);
		}
	}

	if (config.disallowedTools && config.disallowedTools.length > 0) {
		for (const tool of config.disallowedTools) {
			args.push('--disallowedTools', tool);
		}
	}

	if (params.model && config.modelArg) {
		args.push(config.modelArg, params.model);
	}

	if (params.systemPrompt && config.systemPromptArg) {
		args.push(config.systemPromptArg, params.systemPrompt);
	}

	if (params.prompt) {
		args.push(params.prompt);
	}
	return args;
}

/**
 * Build CLI args for resuming an agent via `resumeArgs` (`{sessionId}` is
 * substituted). Prompt is optional — omit for a blank-resume into the TUI,
 * set for a prompt-on-resume flow.
 */
export function buildResumeArgs(
	config: CliBackendConfig,
	params: {prompt?: string; sessionId: string},
): string[] {
	if (config.resumeArgs) {
		const args = config.resumeArgs.map(arg =>
			arg.replace('{sessionId}', params.sessionId),
		);
		if (params.prompt) args.push(params.prompt);
		return args;
	}
	return buildStartArgs(config, params);
}

export type Logger = (message: string) => void;

/**
 * Pre-mark the cwd as trusted in `~/.codex/config.toml` so codex skips its
 * first-run "Do you trust this folder?" prompt. Codex stores this as
 * `[projects."<absolute-cwd>"]\ntrust_level = "trusted"`.
 *
 * Append-only to avoid taking a TOML parser dep: if a `[projects."<cwd>"]`
 * section already exists we leave it untouched (idempotent + preserves any
 * user-set value, including a deliberate "untrusted"); otherwise we append a
 * new section at the end of the file. Section headers are unique in TOML, so
 * "exists or not" is the only check needed.
 *
 * Best-effort: any I/O failure is logged and the spawn proceeds.
 */
function markCodexProjectTrusted(cwd: string, log: Logger): void {
	const path = join(homedir(), '.codex', 'config.toml');
	// JSON.stringify gives us a valid TOML basic-string (same escape rules for
	// `"`, `\`, control chars), so the section header round-trips for any cwd.
	const header = `[projects.${JSON.stringify(cwd)}]`;
	const section = `\n${header}\ntrust_level = "trusted"\n`;

	let existing = '';
	try {
		existing = readFileSync(path, 'utf8');
	} catch {
		// File missing — codex will create the rest of its config on first run;
		// we just need the projects section in place.
	}

	if (existing.split('\n').some(line => line.trim() === header)) return;

	const next = existing.endsWith('\n') || existing.length === 0
		? existing + section.slice(1)
		: existing + section;

	try {
		mkdirSync(dirname(path), {recursive: true});
		const tmp = `${path}.${process.pid}.tmp`;
		writeFileSync(tmp, next, {mode: 0o600});
		renameSync(tmp, path);
	} catch (err) {
		log(
			`TRUST_WRITE_FAILED (codex): ${
				err instanceof Error ? err.message : String(err)
			}`,
		);
	}
}

/**
 * Pre-mark the cwd as trusted in `~/.claude.json` so claude-code skips its
 * first-run "Do you trust the files in this folder?" dialog and the per-project
 * onboarding screen. Without this the spawned PTY sits at an interactive
 * prompt and the headless gateway flow stalls.
 *
 * Project key is the absolute cwd verbatim — that's the form claude-code
 * itself uses. Atomic write via tmp + rename so a concurrent claude-code read
 * never sees a partial file. Best-effort: any I/O error is logged and we let
 * the spawn proceed (worst case the user sees the dialog they would have seen
 * anyway).
 */
function markClaudeProjectTrusted(cwd: string, log: Logger): void {
	const path = join(homedir(), '.claude.json');
	let data: Record<string, unknown> = {};
	try {
		data = JSON.parse(readFileSync(path, 'utf8')) ?? {};
		if (typeof data !== 'object' || Array.isArray(data)) data = {};
	} catch {
		// File missing or unreadable — start from empty config.
	}

	const projects = (data.projects as Record<string, Record<string, unknown>>) ?? {};
	const entry = projects[cwd] ?? {};
	if (
		entry.hasTrustDialogAccepted === true &&
		entry.hasCompletedProjectOnboarding === true
	) {
		return;
	}
	projects[cwd] = {
		...entry,
		hasTrustDialogAccepted: true,
		hasCompletedProjectOnboarding: true,
	};
	data.projects = projects;

	try {
		mkdirSync(dirname(path), {recursive: true});
		const tmp = `${path}.${process.pid}.tmp`;
		writeFileSync(tmp, JSON.stringify(data, null, 2), {mode: 0o600});
		renameSync(tmp, path);
	} catch (err) {
		log(
			`TRUST_WRITE_FAILED: ${
				err instanceof Error ? err.message : String(err)
			}`,
		);
	}
}

export function startAgentProcess(
	sessionId: string,
	config: CliBackendConfig,
	args: string[],
	workingDirectory: string,
	logger?: Logger,
	agent?: string,
): {pid: number | undefined; error?: string} {
	const log = logger || (() => {});

	log(`SPAWN_START: sessionId=${sessionId}`);
	log(`SPAWN_COMMAND: ${config.command}`);
	log(`SPAWN_ARGS: ${JSON.stringify(args)}`);
	log(`SPAWN_CWD: ${workingDirectory}`);

	if (agent === 'claude-code') {
		markClaudeProjectTrusted(workingDirectory, log);
	} else if (agent === 'codex-cli') {
		markCodexProjectTrusted(workingDirectory, log);
	}

	try {
		const {pid} = ptyManager.spawn({
			sessionId,
			command: config.command,
			args,
			cwd: workingDirectory,
			agent,
		});
		log(`SPAWN_PID: ${pid}`);
		return {pid};
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		log(`SPAWN_ERROR: ${errorMsg}`);
		return {pid: undefined, error: errorMsg};
	}
}

export function isProcessRunning(sessionId: string): boolean {
	// Primary source: PtyManager in-memory state for agents spawned under this
	// daemon. Falls back to PID-probe for legacy session records that may have
	// been started before the PTY refactor.
	if (ptyManager.isRunning(sessionId)) return true;

	const session = getSession(sessionId);
	if (!session?.pid) return false;
	try {
		process.kill(session.pid, 0);
		return true;
	} catch {
		return false;
	}
}

export function stopProcess(sessionId: string): boolean {
	if (ptyManager.isRunning(sessionId)) {
		return ptyManager.kill(sessionId, 'SIGTERM');
	}

	// Legacy path: kill by stored PID if PTY manager doesn't know about it.
	const session = getSession(sessionId);
	if (!session?.pid) return false;
	try {
		process.kill(session.pid, 'SIGTERM');
		return true;
	} catch {
		return false;
	}
}

