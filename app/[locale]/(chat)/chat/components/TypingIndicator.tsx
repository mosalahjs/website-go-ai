"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
// Keep the type to preserve compatibility with existing usage.
export type TypingPhase = "thinking" | "searching" | "writing";

type BaseProps = {
  /** Backward-compatible props */
  dotCount?: number;
  delayStep?: number;
  bubbleMaxWidth?: number;
  className?: string;
  /** New props */
  mode?: "words" | "dots";
  phrases?: string[]; // Custom phrases override
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  /** Smart phase coming from parent (thinking/searching/writing) */
  phase?: TypingPhase | null;
};

export const TypingIndicator = memo(function TypingIndicator({
  dotCount = 3,
  delayStep = 0.2,
  bubbleMaxWidth = 0.8,
  className,
  mode = "words",
  phrases,
  typingSpeed = 35,
  deletingSpeed = 20,
  pauseMs = 900,
  phase = null,
}: BaseProps) {
  /** =============== Legacy dots mode =============== */
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

  /** ✅ moved inside useMemo to fix missing dependency warning */
  const phasePhrases = useMemo(
    () =>
      ({
        thinking: ["Thinking…", "Analyzing your question…"],
        searching: ["Searching sources…", "Gathering information…"],
        writing: ["Writing the reply…", "Organizing the answer…"],
      } as Record<TypingPhase, string[]>),
    []
  );

  const activePhrases = useMemo(() => {
    if (phrases?.length) return phrases;
    if (phase) return phasePhrases[phase];
    return [
      "Thinking…",
      "Analyzing your question…",
      "Compiling the response…",
      "Writing now…",
    ];
  }, [phrases, phase, phasePhrases]);

  /** =============== Typewriter state =============== */
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Restart cycle immediately when external phase/phrases change
  useEffect(() => {
    setIdx(0);
    setSub("");
    setDeleting(false);
  }, [phase, phrases]);

  useEffect(() => {
    if (mode !== "words") return;
    const list = activePhrases;
    if (!list.length) return;

    const full = list[idx % list.length];
    const doneWriting = sub === full;
    const doneDeleting = sub === "";

    let delay = typingSpeed;

    if (!deleting) {
      if (!doneWriting) {
        delay = typingSpeed;
        timerRef.current = window.setTimeout(
          () => setSub(full.slice(0, sub.length + 1)),
          delay
        );
      } else {
        delay = pauseMs;
        timerRef.current = window.setTimeout(() => setDeleting(true), delay);
      }
    } else {
      if (!doneDeleting) {
        delay = deletingSpeed;
        timerRef.current = window.setTimeout(
          () => setSub(full.slice(0, sub.length - 1)),
          delay
        );
      } else {
        setDeleting(false);
        setIdx((v) => (v + 1) % list.length);
      }
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [
    mode,
    activePhrases,
    idx,
    sub,
    deleting,
    typingSpeed,
    deletingSpeed,
    pauseMs,
  ]);

  /** =============== Accessibility (EN) =============== */
  const aria =
    phase === "thinking"
      ? "Assistant is thinking…"
      : phase === "searching"
      ? "Assistant is searching…"
      : "Assistant is typing…";

  return (
    <div
      className={cn("flex w-full justify-start animate-slide-up", className)}
      role="status"
      aria-label={aria}
      aria-busy="true"
    >
      <div
        className="rounded-2xl px-4 py-3 bg-chat-bot-bg text-foreground transition-all duration-200"
        style={{ maxWidth: `${bubbleMaxWidth * 100}%` }}
      >
        {mode === "words" ? (
          <div
            className="text-sm leading-relaxed flex items-center gap-1 whitespace-pre-wrap"
            aria-live="polite"
          >
            <span dir="auto">{sub}</span>
            <span
              className="inline-block w-[1ch] border-l-[2px] border-current opacity-75 animate-pulse"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="flex gap-1 items-center h-4">{dots}</div>
        )}
      </div>
    </div>
  );
});
