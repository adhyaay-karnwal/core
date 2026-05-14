import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui";

type Status = "working" | "idle" | "ended" | "initializing" | "unknown";

interface SessionItem {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  taskDisplayId: string | null;
  agent: string;
  dir: string | null;
  updatedAt: string;
  status: Status;
  statusMessage: string;
  running: boolean;
}

const STATUS_LABELS: Record<Status, string> = {
  working: "Working",
  idle: "Idle",
  ended: "Ended",
  initializing: "Starting",
  unknown: "Unknown",
};

const STATUS_DOT_CLASS: Record<Status, string> = {
  working: "bg-amber-500 animate-pulse",
  idle: "bg-emerald-500",
  ended: "bg-gray-400",
  initializing: "bg-blue-500 animate-pulse",
  unknown: "bg-gray-300",
};

function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return "yesterday";
    return `${diffD}d ago`;
  } catch {
    return "";
  }
}

export function CodingSessionsWidget() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = () => {
      fetch("/api/v1/coding-sessions")
        .then((r) => r.json())
        .then((data: { sessions?: SessionItem[] }) => {
          setSessions(data.sessions ?? []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 30_000);
    return () => clearInterval(interval);
  }, []);

  const liveCount = sessions.filter(
    (s) => s.status === "working" || s.status === "idle",
  ).length;

  return (
    <div className="bg-grayAlpha-50 flex h-full flex-col overflow-hidden">
      {liveCount > 0 && (
        <div className="flex items-center justify-start gap-2 px-4 py-2.5 pb-0 pr-2">
          <span className="bg-grayAlpha-100 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
            {liveCount}
          </span>
        </div>
      )}

      {loading ? (
        <div className="mb-4 flex flex-1 items-center justify-center">
          <LoaderCircle className="text-muted-foreground h-4 w-4 animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-muted-foreground px-4 py-3 text-xs">
          No active sessions.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => {
            const href = session.taskId
              ? `/home/tasks/${session.taskId}/coding/${session.id}`
              : null;
            return (
              <div key={session.id} className="border-b">
                <div className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">
                        {session.taskDisplayId && (
                          <span className="text-muted-foreground mr-1 text-sm">
                            {session.taskDisplayId}
                          </span>
                        )}
                        <span>{session.taskTitle ?? "Untitled task"}</span>
                      </p>
                      <p
                        className="text-muted-foreground mt-0.5 truncate text-xs"
                        title={session.statusMessage}
                      >
                        <span
                          className={cn(
                            "mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",
                            STATUS_DOT_CLASS[session.status],
                          )}
                        />
                        {STATUS_LABELS[session.status]} · {session.agent}
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatTime(session.updatedAt)}
                    </span>
                  </div>

                  {href && (
                    <div className="mt-2 flex items-center justify-end">
                      <a
                        href={href}
                        className={cn(buttonVariants({ variant: "secondary" }))}
                      >
                        Open
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
