"use client";

import { useRef } from "react";
import useSWRMutation from "swr/mutation";

export type ChatMessage =
  | { id: string; role: "user"; content: string; timestamp?: Date }
  | { id: string; role: "assistant"; content: string; timestamp?: Date };

type UseStreamArgs = {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  endpoint?: string;
  nResults?: number;
};

function getSessionId(): string | null {
  try {
    return sessionStorage.getItem("session_id");
  } catch {
    return null;
  }
}

function setSessionId(id: string) {
  try {
    sessionStorage.setItem("session_id", id);
  } catch {}
}

export function useStreamMessage({
  setMessages,
  setIsTyping,
  endpoint = "/api/query_goai",
  nResults = 2,
}: UseStreamArgs) {
  const controllerRef = useRef<AbortController | null>(null);

  const fetcher = async (_key: string, { arg: queryText }: { arg: string }) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const existingSession = getSessionId();

    const payload: Record<string, unknown> = {
      query: queryText,
      n_results: nResults,
    };
    if (existingSession) payload.session_id = existingSession;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controllerRef.current.signal,
      cache: "no-store",
    });

    const newSessionId = res.headers.get("x-session-id");
    if (newSessionId && newSessionId !== existingSession) {
      setSessionId(newSessionId);
    }

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/html")) {
        throw new Error(`HTTP ${res.status} (Next.js 404/HTML)`);
      }
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`);
    }

    if (!res.body) throw new Error("No stream body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let assistantCreated = false;
    const assistantId = crypto.randomUUID();
    let accumulated = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // console.log("chunk:", chunk);

        accumulated += chunk;

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];

          if (!assistantCreated) {
            assistantCreated = true;
            next.push({
              id: assistantId,
              role: "assistant",
              content: accumulated,
              timestamp: new Date(),
            });
          } else if (
            last &&
            last.id === assistantId &&
            last.role === "assistant"
          ) {
            next[next.length - 1] = { ...last, content: accumulated };
          } else {
            next.push({
              id: assistantId,
              role: "assistant",
              content: accumulated,
              timestamp: new Date(),
            });
          }
          return next;
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        console.log("Stream aborted");
      } else {
        throw err;
      }
    }

    return accumulated;
  };

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    endpoint,
    fetcher,
    { revalidate: false }
  );

  const mutate = async (queryText: string) => {
    setIsTyping(true);
    try {
      const result = await trigger(queryText, { throwOnError: true });
      return result;
    } catch (err) {
      console.error("Stream error:", err);
      throw err;
    } finally {
      setIsTyping(false);
      controllerRef.current = null;
    }
  };

  return {
    mutate,
    data,
    error,
    isMutating,
    isPending: isMutating,
    reset,
    status: isMutating
      ? "pending"
      : error
      ? "error"
      : data
      ? "success"
      : "idle",
  } as const;
}
