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

  const lastHeightRef = useRef<number>(0);

  const MINOR_DELTA = 8;

  const getDistanceToBottom = useCallback((el: HTMLElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight;
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, [smooth]);

  const stickIfNeeded = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const prev = lastHeightRef.current || 0;
    const curr = el.scrollHeight;
    const delta = Math.max(0, curr - prev);

    lastHeightRef.current = curr;

    if (delta > MINOR_DELTA) {
      scrollToBottom();
      return;
    }

    if (isAtBottomRef.current) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  useEffect(() => {
    if (!active) return;
    const root = containerRef.current;
    const target = endRef.current;
    if (!root || !target) return;

    lastHeightRef.current = root.scrollHeight;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const atBottom = entry.isIntersecting;
        isAtBottomRef.current = atBottom;
        setIsAtBottom(atBottom);
      },
      { root, threshold: 0.98 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el) return;

    lastHeightRef.current = el.scrollHeight;

    const ro = new ResizeObserver(() => {
      const prev = lastHeightRef.current || 0;
      const curr = el.scrollHeight;
      const delta = Math.max(0, curr - prev);

      lastHeightRef.current = curr;

      if (delta <= MINOR_DELTA) {
        if (isAtBottomRef.current) scrollToBottom();
        return;
      }

      scrollToBottom();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [active, scrollToBottom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom = getDistanceToBottom(el) <= 4;
      isAtBottomRef.current = nearBottom;
      setIsAtBottom(nearBottom);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [getDistanceToBottom]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    stickIfNeeded,
  };
}
