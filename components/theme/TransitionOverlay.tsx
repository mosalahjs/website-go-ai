"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

const createVariants = (_delay: number): Variants => ({
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
});

const createTransition = (delay: number): Transition => ({
  duration: 0.5,
  delay,
  ease: [0.83, 0, 0.17, 1],
});

const TransitionOverlayComponent: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  const COLORS = useMemo(
    () =>
      theme === "dark"
        ? ["var(--background)", "var(--main-muted-foreground)", "var(--card)"]
        : ["var(--background)", "var(--main-muted-foreground)", "var(--main)"],
    [theme]
  );

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 1300);
    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (isAnimating) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isAnimating]);

  const layers = useMemo(
    () =>
      COLORS.map((color, i) => (
        <motion.div
          key={color}
          variants={createVariants(i * 0.15)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={createTransition(i * 0.15)}
          style={{ backgroundColor: color }}
          className="absolute inset-0"
        />
      )),
    [COLORS]
  );

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {layers}
        </div>
      )}
    </AnimatePresence>
  );
};

const TransitionOverlay = memo(TransitionOverlayComponent);
TransitionOverlay.displayName = "TransitionOverlay";

export default TransitionOverlay;
