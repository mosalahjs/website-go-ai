/* eslint-disable @typescript-eslint/no-unused-vars */

import { ApiListResponse, Chunk, Session, Topic } from "@/types/dashboard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Opts = { signal?: AbortSignal };

type Role = "user" | "assistant";

type MessageLike = {
  id?: string;
  role?: Role;
  content?: unknown;
  created_at?: string;
  timestamp?: string;
};

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  created_at: string;
  timestamp?: string;
};

type RawSessionLike = {
  id?: string;
  session_id?: string;
  sessionId?: string;
  title?: string;
  created_at?: string;
  createdAt?: string;
  liked?: boolean;
  last_updated?: string | null;
  lastUpdated?: string | null;
  messages?: MessageLike[];
};

type SessionExt = Session & {
  session_id: string;
  liked: boolean;
  last_updated?: string | null;
};

/** ======== Helpers ======== */
const uid = () => {
  try {
    // نتجنّب any هنا باستخدام تعريف ضيق للـ crypto
    const g = globalThis as unknown as {
      crypto?: { randomUUID?: () => string };
    };
    if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
    return `${Date.now()}-${Math.random()}`;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
};

function parseJsonFromText<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON");
  }
}

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return parseJsonFromText<T>(text);
}

async function getJSON<T>(
  url: string,
  opts?: Opts
): Promise<ApiListResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    const data = await safeJson<T>(res);
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

async function postJSON<T>(
  url: string,
  body: unknown,
  opts?: Opts
): Promise<ApiListResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: opts?.signal,
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    const data = await safeJson<T>(res);
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

async function patchJSON<T>(
  url: string,
  body: unknown,
  opts?: Opts
): Promise<ApiListResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: opts?.signal,
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    const data = await safeJson<T>(res);
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}

async function delJSON<T>(
  url: string,
  opts?: Opts
): Promise<ApiListResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      signal: opts?.signal,
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };

    const text = await res.text();
    if (!text || !text.trim()) {
      return { success: true, data: undefined as unknown as T };
    }
    const data = parseJsonFromText<T>(text);
    return { success: true, data };
  } catch {
    return { success: false, error: "Network error" };
  }
}
function coerceMessage(m: unknown, idx = 0): ChatMessage {
  const msg = (m ?? {}) as MessageLike;

  const created =
    (typeof msg.created_at === "string" && msg.created_at) ||
    (typeof msg.timestamp === "string" && msg.timestamp) ||
    new Date().toISOString();

  return {
    id: msg?.id ?? `m_${uid()}_${idx}`,
    role: msg?.role === "assistant" ? "assistant" : "user",
    content: typeof msg?.content === "string" ? msg.content : "",
    created_at: created,
    timestamp: typeof msg?.timestamp === "string" ? msg.timestamp : undefined,
  };
}

function coerceSession(raw: unknown, i = 0): SessionExt {
  const r = (raw ?? {}) as RawSessionLike;

  const generatedId = r?.id ?? r?.session_id ?? r?.sessionId ?? `s_${uid()}`;
  const title =
    (typeof r?.title === "string" && r.title.trim()) ||
    `Session ${String(generatedId).slice(0, 8)}`;

  const createdAt =
    (typeof r?.created_at === "string" && r.created_at) ||
    (typeof r?.createdAt === "string" && r.createdAt) ||
    new Date().toISOString();

  const msgs: ChatMessage[] = Array.isArray(r?.messages)
    ? r.messages.map(coerceMessage)
    : [];

  return {
    id: generatedId as string,
    title,
    created_at: createdAt,
    messages: msgs as unknown as Session["messages"], // نحافظ على التوافق مع نوع Session
    session_id: r?.session_id ?? r?.sessionId ?? String(generatedId),
    liked: Boolean(r?.liked),
    last_updated: r?.last_updated ?? r?.lastUpdated ?? null,
  };
}

/** ------- Mock Data (fallback) ------- */
function mockTopics(): Topic[] {
  return [
    { id: "t_1", name: "Onboarding" },
    { id: "t_2", name: "AI Estimation" },
    { id: "t_3", name: "Scope-3" },
    { id: "t_4", name: "Vendors" },
  ];
}

function mockChunks(): Chunk[] {
  const topics = mockTopics();
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `c_${i + 1}`,
    topic_id: topics[i % topics.length].id,
    content: `Chunk content ${i + 1}`,
    created_at: new Date(Date.now() - i * 12_34_56).toISOString(),
  }));
}

function mockSessions(): SessionExt[] {
  const now = new Date();
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `s_${i + 1}`,
    title: `Session #${i + 1}`,
    created_at: new Date(now.getTime() - i * 36_00_000).toISOString(),
    messages: Array.from({ length: Math.floor(Math.random() * 8) + 3 }).map(
      (__, j) =>
        coerceMessage(
          {
            id: `m_${i + 1}_${j + 1}`,
            role: j % 2 === 0 ? "user" : "assistant",
            content: `Mock message ${j + 1} for session ${i + 1}`,
            created_at: new Date(
              now.getTime() - (i * 36_00_000 + j * 600_000)
            ).toISOString(),
          },
          j
        )
    ) as unknown as Session["messages"],
    session_id: `s_${i + 1}`,
    liked: Math.random() > 0.5,
    last_updated: new Date(now.getTime() - i * 36_00_000).toISOString(),
  }));
}

const mockStore: {
  sessions: SessionExt[];
  topics: Topic[];
  chunks: Chunk[];
} = {
  sessions: mockSessions(),
  topics: mockTopics(),
  chunks: mockChunks(),
};
/** ----------------------------------- */

export const api = {
  /* =========================
     Sessions
     ========================= */
  async getSessions(opts?: Opts): Promise<ApiListResponse<SessionExt[]>> {
    if (API_BASE) {
      const res = await getJSON<RawSessionLike[]>(`${API_BASE}/sessions`, opts);
      if (!res.success) {
        return { success: false, error: res.error ?? "Unknown error" };
      }
      if (!Array.isArray(res.data)) {
        return { success: false, error: "Invalid response" };
      }
      const normalized = res.data.map((r, i) => coerceSession(r, i));
      return { success: true, data: normalized };
    }
    return { success: true, data: mockStore.sessions };
  },

  async createSession(
    input: {
      session_id: string;
      title?: string;
      initialMessage?: { role: Role; content: string };
    },
    opts?: Opts
  ): Promise<ApiListResponse<SessionExt>> {
    if (API_BASE) {
      const res = await postJSON<RawSessionLike>(
        `${API_BASE}/sessions`,
        input,
        opts
      );
      if (!res.success)
        return { success: false, error: res.error ?? "Unknown error" };
      return { success: true, data: coerceSession(res.data) };
    }
    const now = new Date().toISOString();
    const id = uid();
    const msg: ChatMessage[] = input.initialMessage
      ? [coerceMessage({ ...input.initialMessage, created_at: now })]
      : [];
    const created = coerceSession({
      id,
      session_id: input.session_id,
      title: input.title ?? `Session ${input.session_id}`,
      created_at: now,
      last_updated: now,
      liked: false,
      messages: msg,
    });
    mockStore.sessions = [created, ...mockStore.sessions];
    return { success: true, data: created };
  },

  async addMessage(
    session_id: string,
    message: { role: Role; content: string },
    opts?: Opts
  ): Promise<ApiListResponse<true>> {
    if (API_BASE) {
      return postJSON<true>(
        `${API_BASE}/sessions/${encodeURIComponent(session_id)}/messages`,
        message,
        opts
      );
    }
    const idx = mockStore.sessions.findIndex(
      (s) => s.session_id === session_id
    );
    if (idx === -1) return { success: false, error: "Session not found" };
    const m = coerceMessage({
      ...message,
      created_at: new Date().toISOString(),
    });

    const current = mockStore.sessions[idx]
      .messages as unknown as ChatMessage[];
    mockStore.sessions[idx].messages = [
      ...current,
      m,
    ] as unknown as Session["messages"];
    mockStore.sessions[idx].last_updated = new Date().toISOString();
    return { success: true, data: true };
  },

  async editMessage(
    session_id: string,
    message_id: string,
    patch: { content: string },
    opts?: Opts
  ): Promise<ApiListResponse<true>> {
    if (API_BASE) {
      return patchJSON<true>(
        `${API_BASE}/sessions/${encodeURIComponent(
          session_id
        )}/messages/${encodeURIComponent(message_id)}`,
        patch,
        opts
      );
    }
    const s = mockStore.sessions.find((x) => x.session_id === session_id);
    if (!s) return { success: false, error: "Session not found" };
    const msgs = (s.messages as unknown as ChatMessage[]).map((m) =>
      m.id === message_id ? { ...m, content: patch.content } : m
    );
    s.messages = msgs as unknown as Session["messages"];
    s.last_updated = new Date().toISOString();
    return { success: true, data: true };
  },

  async deleteMessage(
    session_id: string,
    message_id: string,
    opts?: Opts
  ): Promise<ApiListResponse<true>> {
    if (API_BASE) {
      return delJSON<true>(
        `${API_BASE}/sessions/${encodeURIComponent(
          session_id
        )}/messages/${encodeURIComponent(message_id)}`,
        opts
      );
    }
    const s = mockStore.sessions.find((x) => x.session_id === session_id);
    if (!s) return { success: false, error: "Session not found" };
    const msgs = (s.messages as unknown as ChatMessage[]).filter(
      (m) => m.id !== message_id
    );
    s.messages = msgs as unknown as Session["messages"];
    s.last_updated = new Date().toISOString();
    return { success: true, data: true };
  },

  async toggleLike(
    session_id: string,
    like: boolean,
    opts?: Opts
  ): Promise<ApiListResponse<true>> {
    if (API_BASE) {
      return patchJSON<true>(
        `${API_BASE}/sessions/${encodeURIComponent(session_id)}`,
        { liked: like },
        opts
      );
    }
    const s = mockStore.sessions.find((x) => x.session_id === session_id);
    if (!s) return { success: false, error: "Session not found" };
    s.liked = like;
    s.last_updated = new Date().toISOString();
    return { success: true, data: true };
  },

  async deleteSession(
    session_id: string,
    opts?: Opts
  ): Promise<ApiListResponse<true>> {
    if (API_BASE) {
      return delJSON<true>(
        `${API_BASE}/sessions/${encodeURIComponent(session_id)}`,
        opts
      );
    }
    mockStore.sessions = mockStore.sessions.filter(
      (s) => s.session_id !== session_id
    );
    return { success: true, data: true };
  },

  /* =========================
     Topics
     ========================= */
  async getTopics(opts?: Opts): Promise<ApiListResponse<Topic[]>> {
    if (API_BASE) {
      return getJSON<Topic[]>(`${API_BASE}/topics`, opts);
    }
    return { success: true, data: mockStore.topics };
  },

  /* =========================
     Chunks
     ========================= */
  async getChunks(opts?: Opts): Promise<ApiListResponse<Chunk[]>> {
    if (API_BASE) {
      return getJSON<Chunk[]>(`${API_BASE}/chunks`, opts);
    }
    return { success: true, data: mockStore.chunks };
  },

  async logout(): Promise<void> {
    try {
      if (API_BASE) {
        await fetch(`${API_BASE}/logout`, {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
      }
    } catch {}
  },
};
