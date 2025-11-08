"use client";

import { useEffect, useRef, useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

/** ===== Types ===== */
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

/** ===== Config ===== */
const TOKEN_DELAY_MS = 14;
const BATCH_EVERY = 18;
const REQUEST_TIMEOUT_MS = 90_000;
const MIN_REQUEST_INTERVAL = 1000; // Prevent spam

const TOKENIZER = /(\n+|[ \t]+|[.,!?;:])/u;
const HAS_MARKDOWN_SYNTAX =
  /(^|\n)\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>\s|`{3,}|^\|)/m;
const ZERO_WIDTH =
  /[\u2000-\u200F\u202A-\u202E\u2066-\u2069\u00AD\u202F\u2060]/g;

/** ===== ⭐ COMPREHENSIVE Farsi to Arabic Normalizer ===== */
function normalizeFarsiToArabic(input: string): string {
  if (!input) return input;

  return (
    input
      // ========== YEH VARIANTS ==========
      .replace(/\u06CC/g, "\u064A") // ی Farsi Yeh → ي Arabic Yeh
      .replace(/\u06D2/g, "\u064A") // ے Urdu Yeh Barree → ي
      .replace(/\u0649/g, "\u064A") // ى Alef Maksura → ي

      // ========== KAF VARIANTS ==========
      .replace(/\u06A9/g, "\u0643") // ک Farsi Kaf → ك Arabic Kaf

      // ========== HEH VARIANTS ==========
      .replace(/\u06BE/g, "\u0647") // ہ Heh Doachashmee → ه Arabic Heh
      .replace(/\u06D5/g, "\u0629") // ە Kurdish Ae → ة Taa Marbouta
      .replace(/\u06C0/g, "\u0629") // ۀ Heh with Yeh above → ة

      // ========== PERSIAN-SPECIFIC LETTERS (no Arabic equivalent) ==========
      .replace(/\u067E/g, "\u0628") // پ Peh → ب Beh
      .replace(/\u0686/g, "\u062C") // چ Tcheh → ج Jeem
      .replace(/\u0698/g, "\u0632") // ژ Jeh → ز Zain
      .replace(/\u06AF/g, "\u0643") // گ Gaf → ك Kaf

      // ========== NUMBERS ==========
      .replace(/[\u06F0-\u06F9]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0x06f0 + 0x0660)
      )

      // ========== ZERO-WIDTH CLEANUP ==========
      .replace(/\u200C/g, "") // Zero Width Non-Joiner
      .replace(/\u200D/g, "") // Zero Width Joiner
  );
}

/** ===== Utilities ===== */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const stripInnerDataPrefix = (s: string) =>
  (s ?? "").replace(/(^|\n)\s*data:\s?/g, "$1");

// ✅ IMPROVEMENT 1: Use sessionStorage instead of localStorage
const getSessionId = () => {
  try {
    return typeof window !== "undefined"
      ? sessionStorage.getItem("session_id")
      : null;
  } catch {
    return null;
  }
};

const setSessionId = (id: string) => {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("session_id", id);
    }
  } catch {
    // Ignore storage errors
  }
};

const clearSessionId = () => {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("session_id");
    }
  } catch {
    // Ignore storage errors
  }
};

function detectMode(
  contentType: string | null
): "sse" | "ndjson" | "json" | "text" {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("text/event-stream")) return "sse";
  if (ct.includes("application/x-ndjson")) return "ndjson";
  if (ct.includes("application/json")) return "json";
  return "text";
}

function splitLines(buffer: string): string[] {
  return buffer.split(/\r?\n/);
}

function safeToastError(title: string, description?: string) {
  try {
    toast.error(title, description ? { description } : undefined);
  } catch {
    // Ignore toast errors
  }
}

function getReadableErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || "Unexpected error";
  try {
    return JSON.stringify(err).slice(0, 200);
  } catch {
    return "Unexpected error";
  }
}

export function useStreamMessage({
  setMessages,
  setIsTyping,
  endpoint = "/api/query_goai",
  nResults = 2,
  setPhase,
}: UseStreamArgs) {
  const controllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const lastRequestTimeRef = useRef<number>(0);

  const assistantIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const hasReceivedFirstChunk = useRef(false);
  const producedRef = useRef(false);

  // ✅ IMPROVEMENT 2: Initialize session on mount
  useEffect(() => {
    mountedRef.current = true;

    // Create session if doesn't exist
    if (!getSessionId()) {
      const newSession =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      setSessionId(newSession);
    }

    return () => {
      mountedRef.current = false;
      try {
        controllerRef.current?.abort();
      } catch {
        // Ignore
      }
      controllerRef.current = null;

      try {
        readerRef.current?.releaseLock?.();
      } catch {
        // Ignore
      }
      readerRef.current = null;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /** ⭐ Append raw text to last assistant message - WITH NORMALIZATION */
  const appendDirectly = useCallback(
    (text: string) => {
      if (!mountedRef.current || !text) return;

      // ✅ CRITICAL: Normalize Farsi → Arabic BEFORE displaying
      const normalizedText = normalizeFarsiToArabic(text);

      producedRef.current = true;

      setMessages((prev) => {
        const next = [...prev];
        const id =
          assistantIdRef.current ??
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
        if (!assistantIdRef.current) assistantIdRef.current = id;

        const last = next[next.length - 1];
        if (!last || last.role !== "assistant" || last.id !== id) {
          next.push({
            id,
            role: "assistant",
            content: normalizedText,
            timestamp: new Date(),
          });
        } else {
          next[next.length - 1] = {
            ...last,
            content: last.content + normalizedText,
          };
        }
        return next;
      });
    },
    [setMessages]
  );

  /** Stream-aware append with smooth typing effect */
  const appendChunk = useCallback(
    async (rawIn: string) => {
      if (!mountedRef.current || !rawIn) return;

      if (!hasReceivedFirstChunk.current) {
        hasReceivedFirstChunk.current = true;
        setIsTyping(false);
        setPhase?.("writing");
      }

      let raw = rawIn.replace(ZERO_WIDTH, "");
      try {
        raw = raw.normalize("NFC");
      } catch {
        // Ignore normalization errors
      }

      // Fast path for markdown/multiline
      if (raw.includes("\n") || HAS_MARKDOWN_SYNTAX.test(raw)) {
        appendDirectly(raw);
        return;
      }

      const tokens = raw.split(TOKENIZER).filter(Boolean);
      if (tokens.length <= 2) {
        appendDirectly(raw);
        return;
      }

      // Animated token-by-token append
      let i = 0;
      for (const token of tokens) {
        if (!mountedRef.current) break;
        appendDirectly(token);
        if (++i % BATCH_EVERY === 0) await sleep(TOKEN_DELAY_MS);
      }
    },
    [appendDirectly, setIsTyping, setPhase]
  );

  const processData = useCallback(
    async (raw: string, forcedEventName?: string) => {
      if (!raw) return;

      try {
        const evt = JSON.parse(raw);

        // Handle delta field directly (new format from proxy)
        if (evt?.delta && typeof evt.delta === "string") {
          await appendChunk(evt.delta);
          return;
        }

        if (evt?.event === "search" || forcedEventName === "search") {
          setPhase?.("searching");
          const maybe = evt?.payload?.delta ?? evt?.payload?.text ?? "";
          if (maybe) await appendChunk(stripInnerDataPrefix(String(maybe)));
          return;
        }

        if (
          evt?.event === "tool" ||
          evt?.event === "tool_start" ||
          forcedEventName === "tool"
        ) {
          setPhase?.("searching");
          return;
        }

        if (evt?.event === "content" || forcedEventName === "content") {
          const delta: string = evt?.payload?.delta ?? "";
          if (delta) await appendChunk(stripInnerDataPrefix(delta));
          return;
        }

        // Fallback to generic delta/text extraction
        const generic =
          evt?.payload?.delta ??
          evt?.delta ??
          evt?.text ??
          (typeof evt === "string" ? evt : "");
        if (generic) {
          await appendChunk(stripInnerDataPrefix(String(generic)));
        }
      } catch {
        // Not JSON, treat as plain text
        await appendChunk(stripInnerDataPrefix(raw));
      }
    },
    [appendChunk, setPhase]
  );

  async function readErrorMessage(res: Response): Promise<string> {
    let raw = "";
    try {
      raw = await res.text();
    } catch {
      return "Failed to read error body";
    }
    try {
      const obj = JSON.parse(raw);
      return (obj?.detail ||
        obj?.message ||
        obj?.error ||
        (typeof obj === "string" ? obj : raw)) as string;
    } catch {
      return raw || `HTTP ${res.status}`;
    }
  }

  /** Core fetcher (SWR Mutation) */
  const fetcher = useCallback(
    async (_key: string, { arg: queryText }: { arg: string }) => {
      try {
        controllerRef.current?.abort();
      } catch {
        // Ignore
      }
      controllerRef.current = new AbortController();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        try {
          controllerRef.current?.abort();
        } catch {
          // Ignore
        }
        safeToastError(
          "Request timed out",
          "The server took too long to respond."
        );
      }, REQUEST_TIMEOUT_MS);

      assistantIdRef.current = null;
      hasReceivedFirstChunk.current = false;
      producedRef.current = false;

      const existingSession = getSessionId();

      const makePayload = (sid: string | null) => {
        const payload: Record<string, unknown> = {
          query: queryText,
          n_results: nResults,
        };
        if (sid) payload.session_id = sid;
        return payload;
      };

      let triedOnceWithoutSession = false;

      const attemptFetch = async (
        sid: string | null
      ): Promise<Response | null> => {
        const payload = makePayload(sid);

        // ✅ IMPROVEMENT 4: Add session to headers
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (sid) {
          headers["X-Session-ID"] = sid;
        }

        try {
          return await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
            signal: controllerRef.current?.signal,
          });
        } catch (err) {
          if (
            (err as Error).name !== "AbortError" &&
            sid &&
            !triedOnceWithoutSession
          ) {
            triedOnceWithoutSession = true;
            clearSessionId();
            return attemptFetch(null);
          }
          throw err;
        }
      };

      let res = await attemptFetch(existingSession);
      if (!res) {
        safeToastError("Request failed", "No response received");
        return "";
      }

      const xSession = res.headers.get("x-session-id");
      if (xSession && xSession !== existingSession) {
        setSessionId(xSession);
      }

      if (!res.ok) {
        const msg = await readErrorMessage(res);

        // ⭐ FIX: Handle 404/500 errors (invalid/expired session) - retry without session
        if (
          (res.status === 404 || res.status === 500) &&
          existingSession &&
          !triedOnceWithoutSession
        ) {
          triedOnceWithoutSession = true;
          clearSessionId();
          const res2 = await attemptFetch(null);

          if (!res2 || !res2.ok) {
            const msg2 = res2 ? await readErrorMessage(res2) : msg;
            safeToastError("Request failed", msg2.slice(0, 200));
            return "";
          }

          // ⭐ SUCCESS: Update with new session and continue processing
          const xSession2 = res2.headers.get("x-session-id");
          if (xSession2) {
            setSessionId(xSession2);
          }

          // Replace res with successful retry response
          res = res2;
        } else if (res.status === 401 || res.status === 403) {
          clearSessionId();
          safeToastError("Session expired", "Please try again.");
          return "";
        } else {
          const ct = res.headers.get("content-type")?.toLowerCase() || "";
          if (ct.includes("text/html")) {
            safeToastError(
              "Request failed",
              `HTTP ${res.status} (Next.js HTML)`
            );
            return "";
          }
          safeToastError("Request failed", msg.slice(0, 200));
          return "";
        }
      }

      if (!res.body) {
        safeToastError("Request failed", "No stream body");
        return "";
      }

      const mode = detectMode(res.headers.get("content-type"));

      /** Fast path for non-streaming responses */
      if (mode !== "sse" && mode !== "ndjson") {
        let responseText = "";

        try {
          const ct = res.headers.get("content-type")?.toLowerCase() || "";
          responseText = await res.text();

          if (ct.includes("application/json")) {
            try {
              const j = JSON.parse(responseText);
              let payload =
                (j &&
                  (j.content || j.delta || j.text || j.message || j.answer)) ??
                j;

              if (typeof payload !== "string") {
                try {
                  payload = JSON.stringify(payload, null, 2);
                } catch {
                  payload = String(payload);
                }
              }
              payload = stripInnerDataPrefix(payload);
              await appendChunk(payload);
            } catch {
              const txt = stripInnerDataPrefix(responseText);
              await appendChunk(txt);
            }
          } else {
            const txt = stripInnerDataPrefix(responseText);
            await appendChunk(txt);
          }
        } catch (e) {
          const msg =
            e instanceof Error
              ? e.message
              : "Failed to read non-stream response";
          safeToastError("Read error", msg);
        } finally {
          if (!producedRef.current && responseText) {
            appendDirectly(responseText);
          }

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsTyping(false);
          setPhase?.(null);
          controllerRef.current = null;
        }
        return "";
      }

      /** Streaming path (SSE/NDJSON) */
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      readerRef.current = reader;
      let textBuffer = "";
      let sawBOM = false;

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          let chunk = value;
          if (!sawBOM) {
            sawBOM = true;
            if (chunk.charCodeAt(0) === 0xfeff) chunk = chunk.slice(1);
          }

          if (mode === "sse") {
            textBuffer += chunk;
            const lines = splitLines(textBuffer);
            textBuffer = lines.pop() ?? "";

            let frameEventName: string | undefined;
            let frameDataLines: string[] = [];

            const flushFrame = async () => {
              if (!frameDataLines.length) return;
              const data = frameDataLines.join("\n");
              if (data.trim() !== "[DONE]")
                await processData(data, frameEventName);
              frameDataLines = [];
              frameEventName = undefined;
            };

            for (const line of lines) {
              const bare = line.endsWith("\r") ? line.slice(0, -1) : line;

              if (!hasReceivedFirstChunk.current && bare && bare[0] !== ":") {
                setPhase?.("thinking");
              }
              if (bare.startsWith(":")) continue;
              if (bare === "") {
                if (frameDataLines.length) await flushFrame();
                continue;
              }

              const idx = bare.indexOf(":");
              const field = idx === -1 ? bare : bare.slice(0, idx);
              const rest = idx === -1 ? "" : bare.slice(idx + 1);

              const value0 = rest.startsWith(" ") ? rest.slice(1) : rest;
              const value = value0.replace(/\r$/, "").replace(/\|$/, "");

              switch (field) {
                case "data":
                  frameDataLines.push(value);
                  break;
                case "event":
                  frameEventName = value || undefined;
                  break;
                default:
                  break;
              }
            }
          } else {
            // NDJSON
            textBuffer += chunk;
            const lines = splitLines(textBuffer);
            textBuffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line) continue;
              await processData(line);
            }
          }
        }

        // Process remaining buffer
        if (textBuffer) {
          if (mode === "sse") {
            const lines = splitLines(textBuffer);
            let frameEventName: string | undefined;
            let frameDataLines: string[] = [];
            for (const line of lines) {
              const bare = line.endsWith("\r") ? line.slice(0, -1) : line;
              if (!bare || bare.startsWith(":")) continue;
              const idx = bare.indexOf(":");
              const field = idx === -1 ? bare : bare.slice(0, idx);
              const rest = idx === -1 ? "" : bare.slice(idx + 1);
              const value0 = rest.startsWith(" ") ? rest.slice(1) : rest;
              const value = value0.replace(/\r$/, "").replace(/\|$/, "");
              if (field === "event") frameEventName = value || undefined;
              else if (field === "data") frameDataLines.push(value);
            }
            if (frameDataLines.length) {
              const data = frameDataLines.join("\n");
              if (data.trim() !== "[DONE]")
                await processData(data, frameEventName);
            }
          } else {
            await processData(textBuffer);
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const msg = getReadableErrorMessage(err);
          safeToastError("Stream error", msg);
        }
        return "";
      } finally {
        try {
          reader.releaseLock();
        } catch {
          // Ignore
        }
        readerRef.current = null;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsTyping(false);
        setPhase?.(null);
      }

      return "";
    },
    [
      endpoint,
      nResults,
      appendChunk,
      appendDirectly,
      processData,
      setIsTyping,
      setPhase,
    ]
  );

  /** SWR Mutation */
  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    endpoint,
    fetcher,
    {
      revalidate: false,
      onError: (err) => {
        const msg = getReadableErrorMessage(err);
        safeToastError("Failed to process request", msg);
      },
    }
  );

  /** Public API */
  const mutate = useCallback(
    async (queryText: string) => {
      if (isMutating || controllerRef.current) {
        console.warn("Request already in progress");
        return null;
      }

      // ✅ IMPROVEMENT 3: Rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTimeRef.current;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const waitTime = Math.ceil(
          (MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000
        );
        safeToastError(
          "Too fast!",
          `Please wait ${waitTime} second${waitTime > 1 ? "s" : ""}`
        );
        return null;
      }

      lastRequestTimeRef.current = now;

      setIsTyping(true);
      setPhase?.("thinking");
      try {
        const result = await trigger(queryText);
        return result;
      } catch (err) {
        const msg = getReadableErrorMessage(err);
        safeToastError("Request failed", msg);
        return null;
      } finally {
        setIsTyping(false);
        setPhase?.(null);
        controllerRef.current = null;
      }
    },
    [isMutating, trigger, setIsTyping, setPhase]
  );

  const abort = useCallback(() => {
    try {
      controllerRef.current?.abort();
    } catch {
      // Ignore
    }
    controllerRef.current = null;
    setIsTyping(false);
    setPhase?.(null);
  }, [setIsTyping, setPhase]);

  return {
    mutate,
    abort,
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
