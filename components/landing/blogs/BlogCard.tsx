"use client";
import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/cta-button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Blog } from "@/types/Blogs";
import Badge from "./Badge";
import Meta from "./Meta";
import { cardVariants, easeSoft } from "./motion";
import { useTranslations } from "next-intl";

type BlogCardProps = {
  blog: Blog;
  featured?: boolean;
};

function BlogCardComponent({ blog, featured }: BlogCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const t = useTranslations("BLOGS");

  const imageSizes = featured
    ? "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
    : "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw";

  return (
    <motion.article
      role="article"
      aria-labelledby={`blog-title-${blog.id}`}
      variants={cardVariants}
      custom={reducedMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative h-full rounded-sm",
        "backdrop-blur-sm",
        "border border-slate-300/60 bg-white/70",
        "dark:border-slate-800/60 dark:bg-slate-900/70",
        "transition-shadow duration-500",
        hovered
          ? "shadow-[0_8px_32px_rgba(59,130,246,0.28)]"
          : "shadow-[0_4px_16px_rgba(59,130,246,0.14)]",
        featured && "md:col-span-2"
      )}
    >
      <Card className="h-full overflow-hidden rounded-sm border-0 shadow-none">
        <div
          className={cn(
            "relative flex h-full flex-col",
            featured ? "md:flex-row" : "flex-col"
          )}
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: easeSoft }}
            className={cn(
              "relative overflow-hidden",
              featured ? "md:w-1/2 h-56 md:h-auto" : "h-56 w-full"
            )}
          >
            <motion.div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-br from-sky-500/10 via-transparent to-cyan-500/10 opacity-0",
                "group-hover:opacity-100 transition-opacity"
              )}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, ease: easeSoft }}
            />
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes={imageSizes}
              className={cn(
                "object-cover",
                !reducedMotion && "transition-transform",
                hovered && "scale-[1.06]"
              )}
              loading={featured ? "eager" : undefined}
              fetchPriority={featured ? "high" : "auto"}
            />

            {/* Overlay for contrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent dark:from-slate-900/60" />
          </motion.div>

          {/* Content */}
          <CardContent
            className={cn(
              "relative flex w-full flex-1 flex-col justify-between p-6 sm:p-8",
              featured && "md:w-1/2"
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reducedMotion ? 0 : 0.5,
                ease: easeSoft,
                delay: 0.05,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  ease: easeSoft,
                  delay: 0.08,
                }}
              >
                <Badge className="mb-4">{blog.category}</Badge>
              </motion.div>

              <motion.h3
                id={`blog-title-${blog.id}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0 : 0.5,
                  ease: easeSoft,
                  delay: 0.12,
                }}
                className={cn(
                  "font-bold leading-tight",
                  featured ? "text-3xl md:text-4xl" : "text-2xl",
                  "bg-gradient-to-r from-secondary-from to-secondary-to text-transparent bg-clip-text"
                )}
              >
                {blog.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0 : 0.45,
                  ease: easeSoft,
                  delay: 0.16,
                }}
                className="mt-3 text-main-muted-foreground"
              >
                {blog.excerpt}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: reducedMotion ? 0 : 0.4,
                ease: easeSoft,
                delay: 0.2,
              }}
              className="mt-6 flex-col xl:flex-row items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/80"
            >
              <Meta date={blog.date} readTime={blog.readTime} />

              <CTAButton
                asChild
                size="md"
                preset="default"
                variant="outline"
                showArrow={false}
                aria-label={`${t("readMore")}: ${blog.title}`}
                className="group/read-more gap-2 px-2 font-semibold"
              >
                <Link href="/blogs" prefetch>
                  <span>{t("readMore")}</span>
                </Link>
              </CTAButton>
            </motion.div>

            {/* Focus ring for the card */}
            <span className="pointer-events-none absolute inset-0 rounded-sm ring-0 ring-sky-400/0 focus-within:ring-2 focus-within:ring-sky-400/50 dark:focus-within:ring-cyan-400/50" />
          </CardContent>
        </div>

        {/* Subtle border glow on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-sm border-2 border-transparent"
          animate={{
            borderColor: hovered ? "rgba(59, 130, 246, 0.45)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: easeSoft }}
          aria-hidden
        />
      </Card>
    </motion.article>
  );
}

export default React.memo(BlogCardComponent);
