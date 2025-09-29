"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import React from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = theme === "light";

  const icon = useMemo(() => {
    if (!mounted) return null;
    return isLight ? (
      <motion.span
        key="moon"
        initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="size-6 text-blue-500" />
      </motion.span>
    ) : (
      <motion.span
        key="sun"
        initial={{ opacity: 0, scale: 0.6, rotate: 90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.6, rotate: -90 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="size-6 text-yellow-400" />
      </motion.span>
    );
  }, [isLight, mounted]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {icon}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default React.memo(ThemeToggle);
