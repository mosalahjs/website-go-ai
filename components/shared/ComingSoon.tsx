"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import React from "react";
import { Link } from "@/i18n/routing";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black text-center px-4">
      {/* Logo Circle Animation */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-[#B4CBE3] to-[#8E969B] shadow-xl flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
      </motion.div>

      {/* Company Name */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#B4CBE3] to-[#8E969B] bg-clip-text text-transparent tracking-wide"
      >
        Go AI 247
      </motion.h2>

      {/* Coming Soon Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="mt-3 text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#B4CBE3] to-[#8E969B] bg-clip-text text-transparent"
      >
        Coming Soon
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        className="mt-4 text-lg md:text-xl text-zinc-400 max-w-xl"
      >
        We’re crafting something innovative and powerful for you.
        <br /> Stay tuned for the launch of{" "}
        <span className="text-[#B4CBE3]">Go AI 247</span>.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
        className="mt-8"
      >
        <Link
          href={`/`}
          className="bg-gradient-to-r from-[#B4CBE3] to-[#8E969B] text-white font-semibold shadow-lg hover:opacity-90 px-6 py-2 text-lg rounded-xl"
        >
          Notify Me
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
