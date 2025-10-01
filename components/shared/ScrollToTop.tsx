"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="fixed bottom-6 right-6 z-50 "
        >
          <Button
            aria-label="Scroll to top"
            onClick={scrollToTop}
            size="icon"
            className="relative rounded-full shadow-xl 
                       bg-gradient-to-r from-blue-500 to-indigo-600 
                       hover:from-indigo-600 hover:to-blue-500 
                       text-white dark:from-gray-700 dark:to-gray-900 
                       dark:hover:from-gray-900 dark:hover:to-gray-700 
                       transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            {/* Arrow with bouncing animation */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowUp className="h-5 w-5" />
            </motion.div>

            {/* Glow / ripple effect */}
            <motion.span
              layoutId="glow"
              className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl opacity-50"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ScrollToTop);
