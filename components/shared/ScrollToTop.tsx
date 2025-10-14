"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import React from "react";

// ====== ClassName tokens ======
const WRAPPER_CLS =
  "fixed bottom-9 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2";

const BUTTON_CLS = `
  relative rounded-full shadow-xl size-11
  bg-gradient-to-r from-blue-500 to-indigo-600 
  hover:from-indigo-600 hover:to-blue-500 
  text-white dark:from-gray-700 dark:to-gray-900 
  dark:hover:from-gray-900 dark:hover:to-gray-700 
  transition-transform duration-300 hover:scale-110 cursor-pointer
`;

const CHEVRON_LINE_CLS = "absolute w-4 h-0.5 left-1/2 -translate-x-1/2";
const CHEVRON_SEG_BASE_CLS = "absolute top-0 w-1/2 h-full";
const GLOW_CLS =
  "pointer-events-none absolute inset-0 rounded-full bg-white/10 blur-lg";

const LABEL_CLS = `
  text-xs font-bold uppercase tracking-widest mt-1 
  bg-gradient-to-r from-blue-500 to-indigo-600 
  dark:from-gray-400 dark:to-gray-200
  bg-clip-text text-transparent
  hover:from-indigo-600 hover:to-blue-500 
  dark:hover:from-gray-200 dark:hover:to-gray-400
  transition-transform duration-300 cursor-pointer select-none
  focus:outline-none
`;

const CONTAINER_MOTION = {
  initial: { opacity: 0, scale: 0.8, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 40 },
  transition: { duration: 0.5, ease: "backOut" as const },
};

const labelAnim = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

const glowAnim = {
  animate: { opacity: [0.3, 0.6, 0.3] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

const chevronAnim = {
  opacity: [0, 1, 1, 0],
  y: [0, -8, -12, -18],
  scale: [0.7, 1, 1, 0.7],
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={CONTAINER_MOTION.initial}
          animate={CONTAINER_MOTION.animate}
          exit={CONTAINER_MOTION.exit}
          transition={CONTAINER_MOTION.transition}
          className={WRAPPER_CLS}
        >
          <Button
            aria-label="Scroll to top"
            onClick={scrollToTop}
            size="icon"
            className={BUTTON_CLS}
          >
            <div className="relative w-7 h-7">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={`chev-${index}`}
                  animate={chevronAnim}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: index * 0.35,
                  }}
                  className={CHEVRON_LINE_CLS}
                  style={{ top: `${10 + index * 6}px` }}
                >
                  <div className="relative w-full h-full">
                    <div
                      className={`${CHEVRON_SEG_BASE_CLS} left-0`}
                      style={{
                        background: "currentColor",
                        transform: "skew(0deg, -30deg)",
                        transformOrigin: "left center",
                      }}
                    />
                    <div
                      className={`${CHEVRON_SEG_BASE_CLS} right-0`}
                      style={{
                        background: "currentColor",
                        transform: "skew(0deg, 30deg)",
                        transformOrigin: "right center",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.span
              className={GLOW_CLS}
              aria-hidden
              animate={glowAnim.animate}
              transition={glowAnim.transition}
            />
          </Button>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={labelAnim.animate}
            transition={labelAnim.transition}
            className={LABEL_CLS}
          >
            Scroll to top
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ScrollToTop);
