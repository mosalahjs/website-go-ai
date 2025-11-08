"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { ChatContainer } from "./ChatContainer";
import { ChatInput, type ChatInputHandle } from "./ChatInput";
import { ChatMessage, useStreamMessage } from "@/hooks/chat/useStreamMessage";

function safeUUID(): string {
  try {
    type MaybeCrypto = { crypto?: Crypto };
    const g: MaybeCrypto =
      typeof globalThis === "object" && globalThis
        ? (globalThis as MaybeCrypto)
        : {};
    const c = g.crypto;

    if (c?.randomUUID) return c.randomUUID();
    if (c?.getRandomValues) {
      const bytes = new Uint8Array(16);
      c.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0")
      ).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
        12,
        16
      )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {
    // ignore
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const STORAGE_KEY = "goai.chat.messages.v1";
const LAST_PATH_KEY = "goai.lastPath";

type PersistMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

function isChatPath(pathname: string) {
  return /\/chat(?:\/|$)/.test(pathname);
}

function loadPersisted(): ChatMessage[] {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const arr = JSON.parse(raw) as PersistMsg[];
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
      .map<ChatMessage>((m) => ({
        id: m.id || safeUUID(),
        role: m.role,
        content: m.content,
        timestamp: m.timestamp ? new Date(m.timestamp) : undefined,
      }));
  } catch {
    return [];
  }
}

function persist(messages: ChatMessage[]) {
  try {
    const slice = messages.slice(-200);
    const out: PersistMsg[] = slice.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : undefined,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch {
    // ignore storage errors
  }
}

function clearPersisted() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/* =========
   Typings to remove any
========= */
declare global {
  interface Window {
    __goaiNavSpyInstalled?: boolean;
  }
}

/**
 * Installs a spy on history navigation to emit a custom event.
 * Returns a detach function.
 */
function installNavigationSpy(onNavigate: () => void) {
  try {
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    if (!window.__goaiNavSpyInstalled) {
      history.pushState = function (
        this: History,
        ...args: Parameters<typeof origPush>
      ): ReturnType<typeof origPush> {
        const ret = origPush.apply(this, args);
        window.dispatchEvent(new Event("goai:navigate"));
        return ret;
      };

      history.replaceState = function (
        this: History,
        ...args: Parameters<typeof origReplace>
      ): ReturnType<typeof origReplace> {
        const ret = origReplace.apply(this, args);
        window.dispatchEvent(new Event("goai:navigate"));
        return ret;
      };

      window.addEventListener("popstate", () => {
        window.dispatchEvent(new Event("goai:navigate"));
      });

      window.__goaiNavSpyInstalled = true;
    }

    const handler = () => {
      try {
        onNavigate();
      } catch {
        // ignore
      }
    };

    window.addEventListener("goai:navigate", handler);
    return () => window.removeEventListener("goai:navigate", handler);
  } catch {
    return () => {};
  }
}

export default function ChatPageClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<ChatInputHandle | null>(null);

  const currentPathRef = useRef<string>("");

  type StreamApi = {
    mutate: (content: string) => Promise<void>;
    abort?: () => void;
    isMutating?: boolean;
    phase?: "thinking" | "searching" | "writing" | null;
  };

  const streamApi = useStreamMessage({
    setMessages,
    setIsTyping,
    endpoint: "/api/query_goai",
    nResults: 2,
  }) as unknown as StreamApi;

  const { mutate: stream, abort, isMutating, phase } = streamApi;

  useEffect(() => {
    currentPathRef.current = window.location.pathname;

    const detach = installNavigationSpy(() => {
      const prev = currentPathRef.current;
      const next = window.location.pathname;

      try {
        sessionStorage.setItem(LAST_PATH_KEY, prev);
      } catch {
        // ignore
      }

      if (isChatPath(prev) && !isChatPath(next)) {
        clearPersisted();
      }

      currentPathRef.current = next;
    });

    return () => detach();
  }, []);

  useEffect(() => {
    const current = window.location.pathname;
    const lastPath = sessionStorage.getItem(LAST_PATH_KEY) || "";

    if (isChatPath(current)) {
      if (lastPath && isChatPath(lastPath)) {
        const restored = loadPersisted();
        if (restored.length) setMessages(restored);
      } else {
        clearPersisted();
        setMessages([]);
      }
    }

    try {
      sessionStorage.setItem(LAST_PATH_KEY, current);
    } catch {
      // ignore
    }

    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    persist(messages);
  }, [messages]);

  const onSend = useCallback(
    async (content: string) => {
      setMessages((prev) => [
        ...prev,
        { id: safeUUID(), role: "user", content, timestamp: new Date() },
      ]);

      try {
        await stream(content);
      } catch (err) {
        console.error("Failed to send message:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: safeUUID(),
            role: "assistant",
            content:
              "Sorry, an error occurred while sending the message. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [stream]
  );

  const onStop = useCallback(() => {
    try {
      abort?.();
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [abort]);

  type ChatContainerProps = React.ComponentProps<typeof ChatContainer>;
  const uiMessages = messages as unknown as ChatContainerProps["messages"];

  const streamingNow = isTyping || !!isMutating;

  return (
    <div className="flex flex-col h-[calc(100vh-3.25rem)] bg-background">
      <ChatContainer
        messages={uiMessages}
        isTyping={streamingNow}
        phase={phase ?? null}
      />
      <div className="border-t border-border bg-background/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            ref={inputRef}
            onSend={onSend}
            disabled={streamingNow}
            isStreaming={streamingNow}
            onStop={onStop}
          />
        </div>
      </div>
    </div>
  );
}
