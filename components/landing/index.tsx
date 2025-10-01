"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  const t = useTranslations("landingPage");

  return (
    <div className="h-[70vh] flex flex-col items-center w-full lg:px-44 py-16">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-9xl mx-auto font-bold bg-clip-text text-transparent
       text-gradient-third"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Go AI 247
      </motion.h1>

      <motion.h3
        className="text-lg md:text-xl font-semibold text-center mt-4 mb-6 bg-clip-text text-transparent
       text-gradient-third
        dark:from-[#8E969B] dark:to-[#525456]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {t("description")}
      </motion.h3>

      <motion.p
        className="text-lg md:text-xl font-semibold text-center mb-6 bg-clip-text text-transparent
text-gradient-third
        dark:from-[#8E969B] dark:to-[#525456]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {t("subDescription")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          asChild
          size="lg"
          className="
      text-white text-base px-8 py-6 rounded-2xl
      bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400
      hover:from-blue-500 hover:via-blue-400 hover:to-blue-300
      shadow-lg hover:shadow-xl transition-all duration-500 group
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
      dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-600
    "
        >
          <Link href="/contact">
            {t("getStarted")}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="
      text-base px-8 py-6 rounded-2xl 
      border-2 border-transparent
      text-blue-600 bg-white bg-clip-padding backdrop-blur-sm
      hover:text-white hover:bg-gradient-to-r 
      hover:from-blue-600 hover:to-blue-400
      transition-all duration-500
      
      dark:text-gray-200 dark:bg-black/30 
      dark:hover:bg-gradient-to-r dark:hover:from-gray-200 dark:hover:to-gray-400 
      dark:hover:text-black
    "
        >
          <Link href="/projects">{t("viewProjects")}</Link>
        </Button>
      </motion.div>
    </div>
  );
}
