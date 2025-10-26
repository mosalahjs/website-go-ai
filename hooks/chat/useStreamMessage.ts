"use client";

import { useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";

export type ChatMessage =
  | { id: string; role: "user"; content: string; timestamp?: Date }
  | { id: string; role: "assistant"; content: string; timestamp?: Date };

type TypingPhase = "thinking" | "searching" | "writing";

type UseStreamArgs = {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  endpoint?: string;
  nResults?: number;
  setPhase?: React.Dispatch<React.SetStateAction<TypingPhase | null>>;
};

/** Debug flags */
const DEBUG_STREAM = true; // network-level chunks
const DEBUG_TOKENS = true; // word-level tokens
const TOKEN_DELAY_MS = 30; // typing effect speed (adjust as needed)

/** Unicode-aware tokenizer: splits into (whitespace) | (punctuation) | (words/numbers) */
const TOKENIZER = /(\s+|[^\p{L}\p{N}\s]+)/u;

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

/** Detects the streaming mode based on Content-Type header */
function detectMode(contentType: string | null) {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("text/event-stream")) return "sse" as const;
  if (ct.includes("application/x-ndjson")) return "ndjson" as const;
  return "text" as const;
}
/** Splits string by line breaks */
function splitLines(buffer: string) {
  return buffer.split(/\r?\n/);
}

export function useStreamMessage({
  setMessages,
  setIsTyping,
  endpoint = "/api/query_goai",
  nResults = 2,
  setPhase,
}: UseStreamArgs) {
  const controllerRef = useRef<AbortController | null>(null);
  const assistantIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const hasReceivedFirstChunk = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  /** Append text directly to the latest assistant message */
  const appendDirectly = (text: string) => {
    if (!mountedRef.current || !text) return;

    setMessages((prev) => {
      const next = [...prev];
      const id = assistantIdRef.current ?? crypto.randomUUID();
      if (!assistantIdRef.current) assistantIdRef.current = id;

      const last = next[next.length - 1];
      if (!last || last.role !== "assistant" || last.id !== id) {
        next.push({
          id,
          role: "assistant",
          content: text,
          timestamp: new Date(),
        });
      } else {
        next[next.length - 1] = {
          ...last,
          content: last.content + text,
        };
      }
      return next;
    });
  };

  /** Word-by-word typing effect; logs each token if DEBUG_TOKENS is on */
  const appendChunk = async (chunk: string) => {
    if (!mountedRef.current || !chunk) return;

    if (!hasReceivedFirstChunk.current) {
      hasReceivedFirstChunk.current = true;
      setIsTyping(false);
      setPhase?.("writing");
    }

    // Split into tokens: words, whitespace, punctuation (Unicode-aware)
    const tokens = chunk
      .split(TOKENIZER)
      .filter((t) => t !== undefined && t !== "");

    // Small chunks? Just append once (avoids overhead)
    if (tokens.length <= 3) {
      if (DEBUG_TOKENS) console.log("[token ⚡ fast]", chunk);
      appendDirectly(chunk);
      return;
    }

    for (const token of tokens) {
      if (!mountedRef.current) break;
      appendDirectly(token);
      if (DEBUG_TOKENS) console.log("[token]", JSON.stringify(token));
      // Smooth typing effect
      // Note: if backend already streams token-by-token, keep this small (or even 0)
      await new Promise((r) => setTimeout(r, TOKEN_DELAY_MS));
    }
  };

  const processData = async (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    try {
      const evt = JSON.parse(line);

      if (evt?.event === "search") {
        setPhase?.("searching");
        const maybe = evt?.payload?.delta ?? evt?.payload?.text ?? "";
        if (maybe) await appendChunk(String(maybe));
        return;
      }

      if (evt?.event === "tool" || evt?.event === "tool_start") {
        setPhase?.("searching");
        return;
      }

      if (evt?.event === "content") {
        const delta: string = evt?.payload?.delta ?? "";
        if (delta) {
          await appendChunk(delta);
        }
        return;
      }

      const generic =
        evt?.payload?.delta ??
        evt?.delta ??
        evt?.text ??
        (typeof evt === "string" ? evt : "");
      if (generic) {
        await appendChunk(String(generic));
        return;
      }
      return;
    } catch {
      await appendChunk(raw);
    }
  };

  const fetcher = async (_key: string, { arg: queryText }: { arg: string }) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    assistantIdRef.current = null;
    hasReceivedFirstChunk.current = false;

    const t0 = performance.now();
    let lastT = t0;
    let chunkIdx = 0;

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

    const mode = detectMode(res.headers.get("content-type"));
    if (DEBUG_STREAM) {
      console.log("[stream] mode:", mode);
      console.log("[stream] started @", new Date().toISOString());
    }

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let textBuffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (DEBUG_STREAM) {
            const totalMs = performance.now() - t0;
            console.log(`[stream] finished. total=${totalMs.toFixed(1)}ms`);
          }
          break;
        }

        if (!value) continue;

        chunkIdx += 1;
        if (DEBUG_STREAM) {
          const now = performance.now();
          const dt = now - lastT;
          lastT = now;
          const preview =
            value.length > 120 ? value.slice(0, 120) + "…" : value;
          console.groupCollapsed(
            `[chunk #${chunkIdx}] +${dt.toFixed(1)}ms | ${value.length} chars`
          );
          console.log(preview);
          console.groupEnd();
        }

        if (mode === "sse") {
          textBuffer += value;
          const lines = splitLines(textBuffer);
          textBuffer = lines.pop() ?? "";
          let frame: string[] = [];

          for (const line of lines) {
            const trimmed = line.trimEnd();
            if (trimmed === "") {
              if (frame.length) {
                const payloadLines = frame
                  .filter((l) => l.startsWith("data:"))
                  .map((l) => l.slice(5).trimStart());
                const data = payloadLines.join("\n");
                if (data) {
                  if (DEBUG_STREAM) console.log("[sse event data]", data);
                  await processData(data);
                }
                frame = [];
              }
            } else {
              if (!hasReceivedFirstChunk.current) {
                setPhase?.("thinking");
              }
              frame.push(trimmed);
            }
          }
        } else if (mode === "ndjson") {
          textBuffer += value;
          const lines = splitLines(textBuffer);
          textBuffer = lines.pop() ?? "";

          for (const line of lines) {
            const l = line.trim();
            if (!l) continue;
            if (DEBUG_STREAM) console.log("[ndjson line]", l);
            await processData(l);
          }
        } else {
          if (!hasReceivedFirstChunk.current) {
            setPhase?.("writing");
          }
          await appendChunk(value);
        }
      }

      if (textBuffer) {
        if (DEBUG_STREAM) console.log("[tail buffer]", textBuffer);
        await processData(textBuffer);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        if (DEBUG_STREAM) console.warn("[stream] aborted by user");
        return "";
      }
      throw err;
    } finally {
      try {
        reader.releaseLock();
      } catch {}
    }

    return "";
  };

  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    endpoint,
    fetcher,
    { revalidate: false }
  );

  const mutate = async (queryText: string) => {
    setIsTyping(true);
    setPhase?.("thinking");
    try {
      const result = await trigger(queryText, { throwOnError: true });
      return result;
    } catch (err) {
      console.error("Stream error:", err);
      throw err;
    } finally {
      setIsTyping(false);
      setPhase?.(null);
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
