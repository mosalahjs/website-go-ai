"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectsData as projects } from "@/constant/Projects";
import { Zap } from "lucide-react";

const categories = ["All", "AI/ML", "Web", "Mobile", "SaaS"];

export default function ProjectsContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const t = useTranslations("Projects");

  const filtered =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-24 relative overflow-hidden">
      {/* ===== Background Animation ===== */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.12),transparent_70%)] dark:bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.25),transparent_70%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="text-center relative z-10 space-y-4 mb-20">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold leading-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {t("heroDescription")}
        </motion.p>
      </section>

      {/* ===== FILTER BUTTONS ===== */}
      <div className="flex justify-center gap-3 mb-12 relative z-10 flex-wrap">
        {categories.map((c) => (
          <Button
            key={c}
            variant={selectedCategory === c ? "default" : "outline"}
            className={`rounded-full px-6 transition-all ${
              selectedCategory === c ? "shadow-lg scale-105" : "hover:scale-105"
            }`}
            onClick={() => setSelectedCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* ===== PROJECTS GRID ===== */}
      <section className="container mx-auto relative z-10 px-4">
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-background/40 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Hover Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 120 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Link href={project.demoLink} target="_blank">
                        <Button className="rounded-full px-6 py-2 text-sm font-semibold bg-white/90 text-black hover:bg-white hover:scale-105 shadow-lg transition-all">
                          🔗 {t("viewDemo")}
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Link href={`/projects/${project.id}`}>
                      <Button
                        variant="ghost"
                        className="group mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                      >
                        {t("viewDetails")} →
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-6"
            >
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t("ctaBadge")}</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("ctaTitle")}
            </h2>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t("ctaSubtitle")}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-primary shadow-2xl hover:shadow-primary/70 transition-all duration-300 text-lg px-8 py-6 rounded-xl  mt-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold  hover:shadow-xl "
                >
                  {t("ctaButton")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
