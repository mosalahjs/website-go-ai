"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = resolvedTheme === "light";

  const icon = useMemo(() => {
    if (!mounted) return null;
    return isLight ? (
      <motion.span
        key="moon"
        initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
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
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <Sun className="size-6 text-zinc-300" />
      </motion.span>
    );
  }, [isLight, mounted]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {icon}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default React.memo(ThemeToggle);
