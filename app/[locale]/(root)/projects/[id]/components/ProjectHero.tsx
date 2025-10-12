"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import BackToProjectsButton from "./BackToProjectsButton";

interface Props {
  gradient: string;
  tags: string[];
  title: string;
  description: string;
  buttonGradientStyles: string;
  image?: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProjectHero({ tags, title, description, image }: Props) {
  return (
    <section className="relative overflow-hidden text-white py-24 min-h-[60vh]">
      {/* ===== Background Image ONLY ===== */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image || "/assets/default-bg.jpg"}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ===== Modern Adaptive Overlay (Light/Dark Mode) ===== */}
      <div
        className="absolute inset-0 z-0 
        bg-gradient-to-b from-white/60 via-white/30 to-transparent 
        dark:from-[#0a0118]/80 dark:via-[#0a0118]/40 dark:to-transparent
        backdrop-blur-[2px]"
      />

      {/* ===== Content ===== */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <BackToProjectsButton />

          <div className="max-w-4xl mx-auto space-y-6 text-white text-center">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/20 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-5xl font-bold drop-shadow-lg">{title}</h1>
            <p className="text-lg text-white/85 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(ProjectHero);
