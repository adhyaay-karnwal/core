<div align="right">
  <details>
    <summary >🌐 Language</summary>
    <div>
      <div align="center">
        <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=en">English</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=zh-CN">简体中文</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=zh-TW">繁體中文</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=ja">日本語</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=ko">한국어</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=hi">हिन्दी</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=th">ไทย</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=fr">Français</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=de">Deutsch</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=es">Español</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=it">Italiano</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=ru">Русский</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=pt">Português</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=nl">Nederlands</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=pl">Polski</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=ar">العربية</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=fa">فارسی</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=tr">Türkçe</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=vi">Tiếng Việt</a>
        | <a href="https://openaitx.github.io/view.html?user=RedPlanetHQ&project=core&lang=id">Bahasa Indonesia</a>
      </div>
    </div>
  </details>
</div>

<div align="center">
  <a href="https://getcore.me">
    <img width="200px" alt="CORE logo" src="https://github.com/user-attachments/assets/bd4e5e79-05b8-4d40-9aff-f1cf9e5d70de" />
  </a>

# Delegate work. Don't babysit agents.

**You write what needs doing. CORE owns it end to end.**

<p align="center">
    <a href="https://getcore.me">
        <img src="https://img.shields.io/badge/Website-getcore.me-c15e50?style=for-the-badge&logo=safari&logoColor=white" alt="Website" />
    </a>
    <a href="https://docs.getcore.me">
        <img src="https://img.shields.io/badge/Docs-docs.getcore.me-22C55E?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Docs" />
    </a>
    <a href="https://discord.gg/YGUZcvDjUa">
        <img src="https://img.shields.io/badge/Discord-community-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />
    </a>
</p>
</div>

---

> You use specialized agents like Claude Code and Cursor. You gather the context, kick off
> the session, and babysit the output. You're the bottleneck. CORE gathers the context,
> runs the agents, coordinates the work, and only pulls you back in when judgment is needed.
> You stop babysitting. You delegate.

Watch CORE handle two coding tasks end to end:

[![CORE Demo](https://img.youtube.com/vi/7y_kt_UTYQs/maxresdefault.jpg)](https://www.youtube.com/watch?v=7y_kt_UTYQs)

---

## Why we're building this

### You're operating, not delegating.

Right now you're the glue. You read the GitHub issue, gather Slack context, check logs, paste it into Claude Code, watch it run, and step in when it gets stuck. That's not delegating. That's operating an agent yourself.

Why? Every agent starts fresh. No persistent memory, no shared source of truth across your tools, no judgment about what should run when. So you stay in the loop for every task.

### Where this is going.

AI is moving from prompt-and-wait to delegate-and-review. As models improve, leverage comes less from model quality and more from delegation quality: how much you can hand off, how clear the brief is, and how reliably the work comes back.

The next layer isn't another coding agent. It's the layer above them: one that gathers context, decides what should run, and owns the task until human judgment is needed.

That layer needs three things individual agents don't have: persistent memory across tasks, connectors across the tools where work lives, and the judgment to coordinate without asking permission at every step.

### How CORE helps.

CORE is that layer. You write what needs doing on a scratchpad, a shared page for tasks, ideas, and work in progress. CORE reads it with you, picks up what's meant for it, gathers context from connected apps and memory, drafts a plan, runs the work through Claude Code or Codex, handles blockers where it can, and only pulls you back in when judgment is needed.

Some tasks are one-shot. Others are recurring or event-triggered. Either way, the loop is the same: you write the task, CORE owns it end to end, you review.

---

## What's inside CORE

| | |
|---|---|
| **Scratchpad** | A daily page for tasks, ideas, and work in progress. Type `[ ]` anywhere and CORE picks it up within 3 minutes. |
| **Tasks** | One-shot or recurring work units with your spec, CORE's plan, live state, and a dedicated chat thread. Each task can spawn multiple coding or browser sessions. |
| **Memory** | A temporal knowledge graph built from your conversations, coding sessions, and connected apps. It stores preferences, decisions, goals, and directives so every task starts with context loaded. |
| **Connectors** | 50+ apps through one MCP endpoint, plus webhook triggers for proactive automation. GitHub, Linear, Jira, Slack, Gmail, Calendar, Sentry, Granola, Todoist, and more. |
| **Skills** | 100+ reusable instructions applied automatically based on context. Use built-in skills or write your own for team-specific workflows. |
| **Gateway** | Runs Claude Code, Codex, or other coding agents on your machine or in Docker / Railway, so CORE keeps working when your laptop is closed. Accessible via Slack, WhatsApp, Telegram, email, or web. |
| **Model agnostic** | Bring your own provider: Anthropic, OpenAI, or open-weight models. Self-host the full stack for full isolation. |

---

## CORE in action

Five types of work worth delegating to CORE.

### Delegate a coding task, come back to a PR.

Tell CORE what needs doing. It gathers context from your repo, apps, and memory, drafts a plan, runs a Claude Code session, handles blockers where it can, and brings back a PR. You review when it's done.

`[ ] Fix the race condition in the checkout flow from issue #312` — CORE loaded the context, spun up a session, and opened the PR. You came back to a diff.

### Clear your backlog while you sleep.

Set a recurring task to pull from your backlog at a set time. CORE works through it while you're offline. Smooth runs are waiting for review in the morning. If something gets stuck, CORE comes back with the one decision it needs.

`[ ] Work through tonight's backlog starting at 11pm` — you wrote that once. PRs and status updates wait every morning. Stuck sessions come back with a tight question, not a stalled tab.

### Automate monitoring. Get pinged only when it matters.

Set a recurring task to watch Sentry, your logs, or any alert source. When something fires, CORE investigates, pulls related traces and prior incidents, and decides whether to handle it or escalate.

A Sentry alert fires at 2am. CORE investigates, suggests the fix, and pings on Slack: *"Issue #847 — fix proposed, awaiting your review."* You approve from your phone. Done.

### Stay current without reading everything.

Set a recurring task to pull what matters from the sources you follow and deliver a short digest on your schedule. You pick the topics, CORE does the reading.

A digest lands in Slack every morning: top HN threads, relevant AI papers, a summary of what moved in the repos you watch. Set up once, runs every day.

### Automate app work. Delegate from wherever you are.

Routine work in connected apps like updating Linear issues, triaging PRs, or summarising assigned reviews runs as recurring tasks. When something urgent comes up away from your desk, create a task from WhatsApp or Slack. The gateway keeps running in Docker or Railway, so CORE picks it up without your laptop.

A PR lands for review. CORE summarises the diff, flags the change worth scrutinising, and asks whether to approve. You reply on Slack. Meanwhile, `[ ] Ship the auth refactor` — sent from WhatsApp at the airport — is already running in a Railway sandbox.

---

## What CORE is not

| | |
|---|---|
| **Not a RAG wrapper.** | Memory isn't just embedded chunks. It's a temporal knowledge graph that tracks what you decided, when, and why. |
| **Not a workflow builder.** | No drag-and-drop. You write what needs doing. CORE figures out the workflow. |
| **Not another Devin.** | CORE proposes plans, you approve. CORE asks for unblocks, you decide. CORE brings back PRs, you review. Agents don't merge on their own. |

---

## Quickstart

Open source and self-hosted. Your data stays in your infra.

**One step:**

```bash
npm install -g @redplanethq/corebrain && corebrain setup
```

The wizard asks for an install dir, AI provider, API key, and chat model, then generates secrets, brings the stack up, and opens `http://localhost:3033`.

**Or one click on Railway:**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/deploy/core)

**Connect a gateway** (laptop, Docker host, or Railway) so CORE can drive your browser, run coding agents, and access local folders:

```bash
corebrain login
corebrain gateway setup
```

**Requirements:** Docker 20.10+, Docker Compose 2.20+, 4 vCPU / 8GB RAM

[Full self-hosting guide →](https://docs.getcore.me/self-hosting/setup)

> ☁️ Want to download our Mac App, sign up for waitlist [here](https://www.getcore.me/)

---

## Benchmark

CORE achieves **88.24%** average accuracy on the [LoCoMo benchmark](https://github.com/RedPlanetHQ/core-benchmark) across single-hop, multi-hop, open-domain, and temporal reasoning.

---

## Docs

Want to understand how CORE works under the hood?

- [**Memory**](https://docs.getcore.me/concepts/memory/overview) — Temporal knowledge graph, fact classification, intent-driven retrieval
- [**Toolkit**](https://docs.getcore.me/concepts/toolkit) — 1000+ actions across 50+ apps via MCP
- [**CORE Agent**](https://docs.getcore.me/concepts/meta-agent) — The orchestrator: triggers, memory, tools, sub-agents
- [**Gateway**](https://docs.getcore.me/access-core/overview) — WhatsApp, Slack, Telegram, email, web, API
- [**Skills & Triggers**](https://docs.getcore.me/toolkit/overview) — Scheduled automations and event-driven workflows
- [**API Reference**](https://docs.getcore.me/api-reference) — REST API and endpoints
- [**Self-hosting**](https://docs.getcore.me/self-hosting/setup) — Full deployment guide
- [**Changelog**](https://docs.getcore.me/opensource/changelog) — What's shipped

---

## Security

- CASA Tier 2 Certified
- TLS 1.3 in transit
- AES-256 at rest
- Your data is never used for model training
- Self-host for full isolation
- [Security Policy →](SECURITY.md)
- Vulnerabilities: harshith@poozle.dev

---

## Community

We're building personal AI in the open.

- [Discord](https://discord.gg/YGUZcvDjUa) — questions, ideas, show-and-tell
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to set up and send a PR
- [`good-first-issue`](https://github.com/RedPlanetHQ/core/labels/good-first-issue) — start here

<a href="https://github.com/RedPlanetHQ/core/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=RedPlanetHQ/core" />
</a>

---

<div align="center">

**Write it. CORE handles it.**

[⭐ Star this repo](https://github.com/RedPlanetHQ/core) · [📖 Read the docs](https://docs.getcore.me) · [💬 Join Discord](https://discord.gg/YGUZcvDjUa)

</div>
