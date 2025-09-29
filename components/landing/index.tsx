"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import React from "react";

export default function Landing() {
  const t = useTranslations("landingPage");

  return (
    <div className="h-screen flex flex-col items-center w-full lg:px-44 py-16">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-9xl mx-auto font-bold bg-clip-text text-transparent
        bg-gradient-to-r from-[#0C73E3] via-[#B4CBE3] to-[#D9DEE2]
        dark:from-[#1F1E24] dark:via-[#525456] dark:to-[#8E969B]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Go AI 247
      </motion.h1>

      <motion.h3
        className="text-lg md:text-xl font-semibold text-center mt-4 mb-6 bg-clip-text text-transparent
        bg-gradient-to-r from-[#0C73E3] to-[#B4CBE3]
        dark:from-[#8E969B] dark:to-[#525456]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {t("description")}
      </motion.h3>
    </div>
  );
}
