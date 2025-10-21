"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  active: boolean;
  smooth?: boolean;
};

export function useAutoScroll<T extends HTMLElement>({
  active,
  smooth = true,
}: Options) {
  const containerRef = useRef<T | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const isAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [smooth]);

  const stickIfNeeded = useCallback(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if (!active) return;
    const root = containerRef.current;
    const target = endRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const atBottom = entry.isIntersecting;
        isAtBottomRef.current = atBottom;
        setIsAtBottom(atBottom);
      },
      {
        root,
        threshold: 1.0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      const nearBottom = distance <= 4;
      isAtBottomRef.current = nearBottom;
      setIsAtBottom(nearBottom);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    stickIfNeeded,
  };
}
