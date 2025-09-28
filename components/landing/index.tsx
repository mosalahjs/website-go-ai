"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import React from "react";

export default function Landing() {
  const t = useTranslations("landingPage");

  return (
    <div className="h-screen flex flex-col items-center w-full px-44 py-16">
      <motion.h1
        className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-gray-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Go Ai 247
      </motion.h1>

      <motion.h3
        className="text-xl font-semibold text-center mt-4 mb-6 bg-gradient-to-r from-blue-500 to-gray-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {t("description")}
      </motion.h3>
    </div>
  );
}
