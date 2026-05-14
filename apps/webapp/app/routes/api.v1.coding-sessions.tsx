import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { createHybridActionApiRoute } from "~/services/routeBuilders/apiBuilder.server";
import { createCodingSession } from "~/services/coding/coding-session.server";
import { requireUser, getWorkspaceId } from "~/services/session.server";
import { prisma } from "~/db.server";
import { callTool } from "~/services/gateway/transport.server";

const CreateCodingSessionSchema = z.object({
  taskId: z.string().optional(),
  conversationId: z.string().optional(),
  gatewayId: z.string().optional(),
  agent: z.string().min(1),
  prompt: z.string().optional(),
  dir: z.string().optional(),
  externalSessionId: z.string().optional(),
  worktreePath: z.string().optional(),
  worktreeBranch: z.string().optional(),
});

type GatewaySessionStatus =
  | "working"
  | "idle"
  | "ended"
  | "initializing"
  | "unknown";

interface GatewayListedSession {
  sessionId: string;
  running: boolean;
  status: GatewaySessionStatus;
  statusMessage: string;
}

/**
 * GET /api/v1/coding-sessions — list recent workspace CodingSession rows with
 * live status merged from each linked gateway. Used by the daily "Coding
 * sessions" widget; safe to poll. Drops gateway-side detail (turns, fileSize)
 * because the widget only needs `status` + display fields.
 *
 * Status taxonomy matches `coding_read_session` / `coding_list_sessions` on
 * the gateway:
 *   - working      — PTY alive, last transcript turn is from the user
 *   - idle         — PTY alive, last turn is the assistant's (waiting for user)
 *   - ended        — PTY gone
 *   - initializing — PTY alive but transcript not yet readable
 *   - unknown      — gateway unreachable or did not return this session
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const workspaceId = (await getWorkspaceId(
    request,
    user.id,
    user.workspaceId,
  )) as string;

  const rows = await prisma.codingSession.findMany({
    where: {
      workspaceId,
      externalSessionId: { not: null },
      gatewayId: { not: null },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      agent: true,
      dir: true,
      updatedAt: true,
      taskId: true,
      externalSessionId: true,
      gatewayId: true,
      task: { select: { title: true, displayId: true } },
    },
  });

  const gatewayIds = Array.from(
    new Set(rows.map((r) => r.gatewayId!).filter(Boolean)),
  );

  const statusByExternalId = new Map<
    string,
    { status: GatewaySessionStatus; statusMessage: string; running: boolean }
  >();

  await Promise.all(
    gatewayIds.map(async (gatewayId) => {
      try {
        const result = (await callTool(
          gatewayId,
          "coding_list_sessions",
          { limit: 100 },
          10_000,
        )) as { sessions?: GatewayListedSession[] };
        for (const s of result.sessions ?? []) {
          statusByExternalId.set(s.sessionId, {
            status: s.status,
            statusMessage: s.statusMessage,
            running: s.running,
          });
        }
      } catch {
        // Gateway unreachable — its sessions fall through to "unknown".
      }
    }),
  );

  // Live-only: only return sessions whose PTY is currently alive on a gateway.
  // Ended sessions and sessions we couldn't probe are dropped entirely so the
  // widget shows just what's actively running right now.
  const sessions = rows
    .map((r) => {
      const meta = statusByExternalId.get(r.externalSessionId!);
      if (!meta || !meta.running) return null;
      return {
        id: r.id,
        taskId: r.taskId,
        taskTitle: r.task?.title ?? null,
        taskDisplayId: r.task?.displayId ?? null,
        agent: r.agent,
        dir: r.dir,
        updatedAt: r.updatedAt.toISOString(),
        status: meta.status,
        statusMessage: meta.statusMessage,
        running: true,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  return json({ sessions });
}

const { action } = createHybridActionApiRoute(
  {
    body: CreateCodingSessionSchema,
    allowJWT: true,
    corsStrategy: "all",
  },
  async ({ body, authentication }) => {
    const workspaceId = authentication.workspaceId as string;
    const userId = authentication.userId;

    const session = await createCodingSession({
      workspaceId,
      userId,
      ...body,
    });

    return json(session, { status: 201 });
  },
);

export { action };
