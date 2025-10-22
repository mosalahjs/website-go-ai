"use client";

import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TypingIndicatorProps } from "@/types/Chat";

export const TypingIndicator = memo(function TypingIndicator({
  dotCount = 3,
  delayStep = 0.2,
  bubbleMaxWidth = 0.8,
  className,
}: TypingIndicatorProps) {
  const dots = useMemo(() => {
    return Array.from({ length: dotCount }).map((_, i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-current animate-typing"
        style={{ animationDelay: `${i * delayStep}s` }}
        aria-hidden="true"
      />
    ));
  }, [dotCount, delayStep]);

  return (
    <div
      className={cn("flex w-full justify-start animate-slide-up", className)}
      role="status"
      aria-label="المساعد يكتب الآن..."
      aria-busy="true"
    >
      <div
        className="rounded-2xl px-4 py-3 bg-chat-bot-bg text-foreground transition-all duration-200"
        style={{ maxWidth: `${bubbleMaxWidth * 100}%` }}
      >
        <div className="flex gap-1 items-center h-4">{dots}</div>
      </div>
    </div>
  );
});
