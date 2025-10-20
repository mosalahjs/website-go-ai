"use client";
import { motion } from "framer-motion";
import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import dynamic from "next/dynamic";
const ThemeToggle = dynamic(() => import("@/components/navbar/ThemeToggle"), {
  ssr: false,
});

type ActionsProps = {
  showOn?: "desktop" | "mobile" | "always";
};

const Actions: React.FC<ActionsProps> = ({ showOn = "desktop" }) => {
  const visibilityClass = React.useMemo(() => {
    switch (showOn) {
      case "mobile":
        return "flex lg:hidden";
      case "always":
        return "flex";
      default:
        return "hidden lg:flex";
    }
  }, [showOn]);

  return (
    <motion.div
      className={`${visibilityClass} items-center gap-4 space-x-4 space-x-reverse`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35 }}
    >
      <LanguageSwitcher />
      <ThemeToggle />
    </motion.div>
  );
};

export default React.memo(Actions);
