"use client";
import { motion } from "framer-motion";
import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Actions: React.FC = () => {
  return (
    <motion.div
      className="hidden md:flex items-cente gap-4 space-x-4 space-x-reverse"
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
