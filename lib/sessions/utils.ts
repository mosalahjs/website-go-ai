import type { Session, Message } from "@/types/dashboard/sessions.type";

export function getSessionTitle(session: Session): string {
  if (!session) return "Untitled";
  if (session.title?.trim()) return session.title.trim();

  const messages = session.messages ?? [];
  if (!messages.length) return "Empty Session";

  const first = messages[0]?.content ?? "";
  const clean = first.replace(/\s+/g, " ").trim();
  return clean.length > 50 ? clean.slice(0, 50) + "..." : clean || "Untitled";
}

export const uid = (): string => {
  const g = globalThis as unknown as {
    crypto?: { randomUUID?: () => string };
  };

  try {
    if (typeof g.crypto?.randomUUID === "function") {
      return g.crypto.randomUUID();
    }
  } catch {}
  return Math.random().toString(36).slice(2);
};

export const deriveTitle = (messages: Message[], fallback = "New Session") => {
  if (!messages?.length) return fallback;
  const first = (messages[0]?.content ?? "").replace(/\s+/g, " ").trim();
  return first.length
    ? first.length > 60
      ? first.slice(0, 60) + "…"
      : first
    : fallback;
};

export const createMessage = (
  args: Omit<Message, "id" | "created_at">
): Message => ({
  id: uid(),
  created_at: new Date().toISOString(),
  ...args,
});

export function getSessionId(session: Session): string {
  return session.session_id ?? session.id;
}

export function ensureSessionId<T extends Session>(
  session: T
): T & { session_id: string } {
  return {
    ...session,
    session_id: session.session_id ?? session.id,
  };
}
