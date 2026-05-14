import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { requireUser, getWorkspaceId } from "~/services/session.server";
import { getCodingSessionForResume } from "~/services/coding/coding-session.server";
import { spawnCodingSession } from "~/services/gateway/transport.server";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireUser(request);
  const workspaceId = (await getWorkspaceId(
    request,
    user.id,
    user.workspaceId,
  )) as string;

  const { sessionId } = params;
  if (!sessionId) return json({ error: "Missing sessionId" }, { status: 400 });

  const session = await getCodingSessionForResume(sessionId, workspaceId);
  if (!session) {
    return json({ error: "Session not found" }, { status: 404 });
  }
  if (!session.gatewayId || !session.dir || !session.externalSessionId) {
    return json(
      { error: "Session is not resumable (missing gateway/dir/externalSessionId)" },
      { status: 400 },
    );
  }

  try {
    const spawn = await spawnCodingSession(session.gatewayId, {
      agent: session.agent,
      dir: session.dir,
      sessionId: session.externalSessionId,
    });
    return json({ ok: true, status: spawn.status });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "failed to resume" },
      { status: 502 },
    );
  }
}
