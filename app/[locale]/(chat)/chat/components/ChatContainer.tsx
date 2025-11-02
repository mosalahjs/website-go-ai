"use client";

import React, { memo, useEffect, useMemo, useRef } from "react";
import type { ChatContainerProps, Message } from "@/types/Chat";
import { EmptyState } from "./EmptyState";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { useAutoScroll } from "@/hooks/chat/useAutoScroll";
import Container from "@/components/shared/Container";

type TypingPhase = "thinking" | "searching" | "writing";

export const ChatContainer = memo(function ChatContainer({
  messages,
  isTyping = false,
  disableAutoScroll = false,
  className,
  phase = null,
}: ChatContainerProps & { phase?: TypingPhase | null }) {
  const { containerRef, endRef, scrollToBottom, isAtBottom, stickIfNeeded } =
    useAutoScroll<HTMLDivElement>({
      active: !disableAutoScroll,
      smooth: true,
    });

  const prevLenRef = useRef(0);

  useEffect(() => {
    const prev = prevLenRef.current;
    const curr = messages.length;
    if (curr > prev) {
      const last = messages[curr - 1];

      if (last?.role === "user") {
        scrollToBottom();
      } else if (last?.role === "assistant") {
        stickIfNeeded();
      }
    }
    prevLenRef.current = curr;
  }, [messages, scrollToBottom, stickIfNeeded]);

  useEffect(() => {
    if (isTyping && isAtBottom) stickIfNeeded();
  }, [isTyping, isAtBottom, stickIfNeeded]);

  const items = useMemo(
    () =>
      messages.map((m: Message) => (
        <ChatMessage key={m.id} role={m.role} content={m.content} />
      )),
    [messages]
  );

  const hasMessages = messages.length > 0;

  return (
    <div
      ref={containerRef}
      className={[
        "flex-1 overflow-y-auto px-4 py-6 space-y-6",
        "overscroll-contain",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <Container fullHeight className="flex flex-col">
        {!hasMessages ? <EmptyState /> : <>{items}</>}
        {isTyping && <TypingIndicator mode="words" phase={phase} />}
        <div ref={endRef} aria-hidden className="h-0 w-0" />
      </Container>
    </div>
  );
});
