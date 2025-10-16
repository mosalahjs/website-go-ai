"use client";
import { memo, useMemo, useCallback, useTransition, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectsData as projects } from "@/constant/Projects";
import { Zap } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";

/* ===========================
   Motion Variants
   =========================== */
const categories = ["All", "AI/ML", "Web", "Mobile", "SaaS"] as const;

const heroTitleVariants = {
  hidden: { y: 28, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 220, damping: 24 },
  },
} as const;

const heroParagraphVariants = {
  hidden: { y: 18, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 26, delay: 0.08 },
  },
} as const;

const cardVariants = (i: number) =>
  ({
    hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        delay: i * 0.06,
      },
    },
  } as const);

const gridVariants = {
  show: { transition: { staggerChildren: 0.05 } },
} as const;

/* ===========================
   Component
   =========================== */
function ProjectsContentComponent() {
  const t = useTranslations("Projects");
  const [isPending, startTransition] = useTransition();
  const reducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = useMemo(
    () =>
      selectedCategory === "All"
        ? projects
        : projects.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const handleCategoryClick = useCallback(
    (category: string) => startTransition(() => setSelectedCategory(category)),
    [startTransition]
  );

  return (
    <div className="pt-24 relative overflow-hidden">
      {/* ===== Background Animation ===== */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.12),transparent_70%)] dark:bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.25),transparent_70%)]"
        animate={
          reducedMotion
            ? undefined
            : { backgroundPosition: ["0% 0%", "100% 100%"] }
        }
        transition={
          reducedMotion
            ? undefined
            : { duration: 28, repeat: Infinity, ease: "linear" }
        }
      />

      {/* ===== HERO SECTION ===== */}
      <section className="text-center relative z-10 space-y-4 mb-20">
        <motion.h1
          variants={heroTitleVariants}
          initial="hidden"
          animate="show"
          className="text-5xl font-extrabold leading-16 bg-clip-text text-transparent bg-gradient-to-r from-secondary-from to-secondary-to"
        >
          {t("heroTitle")}
        </motion.h1>
        <motion.p
          variants={heroParagraphVariants}
          initial="hidden"
          animate="show"
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
            onClick={() => handleCategoryClick(c)}
            aria-pressed={selectedCategory === c}
            aria-label={`Filter by ${c}`}
            disabled={isPending && selectedCategory !== c}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* ===== PROJECTS GRID ===== */}
      <section className="container mx-auto relative z-10 px-4">
        <motion.div
          layout
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                variants={cardVariants(i)}
                initial="hidden"
                animate="show"
                whileHover={reducedMotion ? undefined : { y: -8, scale: 1.01 }}
                transition={
                  reducedMotion
                    ? undefined
                    : { type: "spring", stiffness: 280, damping: 20 }
                }
                className="group relative overflow-hidden rounded-3xl border border-border bg-background/40 backdrop-blur-md shadow-lg hover:shadow-2xl transition-[box-shadow,transform] duration-500"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    whileHover={reducedMotion ? undefined : { scale: 1.06 }}
                    transition={
                      reducedMotion
                        ? undefined
                        : { type: "spring", stiffness: 220, damping: 24 }
                    }
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={i < 2}
                      loading={i < 2 ? "eager" : "lazy"}
                    />

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={reducedMotion ? undefined : { opacity: 1 }}
                      transition={
                        reducedMotion
                          ? undefined
                          : { duration: 0.35, ease: "easeOut" }
                      }
                    />

                    {/* Hover Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      whileHover={
                        reducedMotion ? undefined : { opacity: 1, y: 0 }
                      }
                      transition={
                        reducedMotion
                          ? undefined
                          : { type: "spring", stiffness: 240, damping: 22 }
                      }
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Desktop: both buttons side-by-side */}
                      <div className="hidden lg:flex items-center gap-3">
                        {/* View Demo — with Play icon + arrow */}
                        <CTAButton
                          asChild
                          size="md"
                          preset="demo"
                          showArrow={false}
                        >
                          <Link
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("viewDemo")}
                          </Link>
                        </CTAButton>

                        {/* View Details — with animated arrow (default) */}
                        <CTAButton asChild size="md">
                          <Link
                            href={`/projects/${project.id}`}
                            prefetch={false}
                          >
                            {t("viewDetails")}
                          </Link>
                        </CTAButton>
                      </div>

                      {/* Mobile: one button (Demo) */}
                      <div className="lg:hidden">
                        <CTAButton asChild size="md" preset="demo">
                          <Link
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("viewDemo")}
                          </Link>
                        </CTAButton>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold leading-14 bg-clip-text text-transparent bg-gradient-to-r from-secondary-from to-secondary-to">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1" aria-label="Tags">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Bottom button for small screens (Details) */}
                  <div className="pt-3 lg:hidden">
                    <CTAButton asChild size="lg">
                      <Link href={`/projects/${project.id}`} prefetch={false}>
                        {t("viewDetails")}
                      </Link>
                    </CTAButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-from to-primary-to backdrop-blur-sm border border-primary/20 mb-6"
            >
              <Zap className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                {t("ctaBadge")}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-14 bg-clip-text text-transparent bg-gradient-to-r from-secondary-from to-secondary-to">
              {t("ctaTitle")}
            </h2>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t("ctaSubtitle")}
            </p>
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0 }}
              whileInView={reducedMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <CTAButton asChild size="lg" className="group">
                <Link
                  href="/contact"
                  className="flex items-center justify-center"
                >
                  {t("ctaButton")}
                </Link>
              </CTAButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default memo(ProjectsContentComponent);
