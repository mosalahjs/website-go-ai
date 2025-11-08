"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/ui/cta-button";

import BlogCard from "./BlogCard";
import type { Blog } from "@/types/Blogs";
import { containerVariants, easeSoft } from "./motion";
import { ALL_BLOGS } from "@/constant/Blogs";

const BlogSection: React.FC = React.memo(function BlogSection() {
  const reducedMotion = useReducedMotion();

  const t = useTranslations("BLOG_SECTION");

  const tBlogs = useTranslations("BLOGS");
  const translatedItems = tBlogs.raw("items") as Partial<Blog>[];

  const mergedBlogs: ReadonlyArray<Blog> = React.useMemo(() => {
    return translatedItems.map((item) => {
      const original = ALL_BLOGS.find((b) => b.id === item.id);

      return original
        ? ({
            ...original,
            ...item,
            image: original.image,
          } as Blog)
        : (item as Blog);
    });
  }, [translatedItems]);

  const BLOGS: ReadonlyArray<Blog> = React.useMemo(
    () => mergedBlogs.slice(0, 3),
    [mergedBlogs]
  );

  return (
    <section
      aria-labelledby="blog-section-title"
      className={cn("relative min-h-screen py-16 sm:py-20")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: easeSoft,
          }}
          className="mb-12 text-center sm:mb-16"
        >
          <motion.div
            initial={{ scale: reducedMotion ? 1 : 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: easeSoft }}
            className="mb-4 inline-block"
          >
            <span
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium backdrop-blur",
                "text-white  bg-gradient-to-r from-primary-from to-primary-to border border-primary/20"
              )}
            >
              {t("badge")}
            </span>
          </motion.div>

          <h2
            id="blog-section-title"
            className={cn(
              "text-gradient-third ",
              "text-4xl font-bold sm:text-5xl md:text-6xl !leading-18"
            )}
          >
            {t("heading")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-main-muted-foreground">
            {t("subheading")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          custom={reducedMotion}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {BLOGS.map((b, i) => (
            <BlogCard key={b.id} blog={b} featured={i === 0} />
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0 : 0.2,
            duration: reducedMotion ? 0 : 0.4,
            ease: easeSoft,
          }}
          className="mt-12 text-center sm:mt-16"
        >
          <CTAButton
            asChild
            size="lg"
            preset="default"
            variant="default"
            showArrow={false}
            aria-label={t("viewAll")}
          >
            <Link href="/blogs" aria-label={t("viewAll")}>
              <span className="mr-2">{t("viewAll")}</span>
            </Link>
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
});

export default BlogSection;
