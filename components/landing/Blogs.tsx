"use client";
import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  motion,
  useReducedMotion,
  cubicBezier,
  type Variants,
} from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CTAButton } from "../ui/cta-button";

/** ===================== Types ===================== */
type Blog = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
};

/** ===================== Data ===================== */
const ALL_BLOGS: ReadonlyArray<Blog> = [
  {
    id: 1,
    title: "The Future of AI in Software Development",
    excerpt:
      "Explore how artificial intelligence is revolutionizing the way we build and deploy applications in 2025.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "AI & Technology",
    tags: ["AI", "Development", "Future"],
  },
  {
    id: 2,
    title: "Building Scalable Cloud Infrastructure",
    excerpt:
      "Best practices for designing and implementing cloud-native solutions that grow with your business.",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=80",
    date: "March 10, 2025",
    readTime: "7 min read",
    category: "Cloud Computing",
    tags: ["Cloud", "Infrastructure", "Scalability"],
  },
  {
    id: 3,
    title: "Modern Web Development Trends",
    excerpt:
      "Stay ahead of the curve with the latest frameworks, tools, and methodologies in web development.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    date: "March 5, 2025",
    readTime: "6 min read",
    category: "Web Development",
    tags: ["Web", "Trends", "Framework"],
  },
  {
    id: 4,
    title: "Cybersecurity Best Practices for 2025",
    excerpt:
      "Protect your applications and data with these essential security measures and strategies.",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80",
    date: "February 28, 2025",
    readTime: "8 min read",
    category: "Security",
    tags: ["Security", "Best Practices", "Protection"],
  },
  {
    id: 5,
    title: "Machine Learning for Business Intelligence",
    excerpt:
      "Leverage ML algorithms to extract valuable insights from your business data.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    date: "February 20, 2025",
    readTime: "6 min read",
    category: "AI & Technology",
    tags: ["ML", "Business", "Analytics"],
  },
  {
    id: 6,
    title: "DevOps Culture and Continuous Integration",
    excerpt:
      "Improve your development workflow with CI/CD pipelines and DevOps practices.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    date: "February 15, 2025",
    readTime: "7 min read",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Automation"],
  },
] as const;

/** ===================== Motion (typed) ===================== */
const easeSoft = cubicBezier(0.22, 1, 0.36, 1);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (rm: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: rm ? 0 : 0.08,
    },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (rm: boolean) => ({
    opacity: 1,
    y: 0,
    transition: rm
      ? { duration: 0 }
      : {
          duration: 0.6,
          ease: easeSoft,
        },
  }),
};

/** ===================== Subcomponents ===================== */
const Badge = React.memo(function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold",
        "border-sky-500/30 bg-sky-500/10 text-sky-700",
        "dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200",
        className
      )}
    >
      {children}
    </span>
  );
});

const Meta = React.memo(function Meta({
  date,
  readTime,
}: {
  date: string;
  readTime: string;
}) {
  return (
    <div className="flex items-center gap-4 text-sm text-main-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <FiCalendar aria-hidden className="h-4 w-4" />
        <span>{date}</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <FiClock aria-hidden className="h-4 w-4" />
        <span>{readTime}</span>
      </span>
    </div>
  );
});

/** ===================== BlogCard ===================== */
const BlogCard = React.memo(function BlogCard({
  blog,
  featured,
}: {
  blog: Blog;
  featured?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const reducedMotion = useReducedMotion();

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
        "group relative h-full rounded-2xl",
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
      <Card className="h-full overflow-hidden rounded-2xl border-0 shadow-none">
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
              className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/80"
            >
              <Meta date={blog.date} readTime={blog.readTime} />

              <CTAButton
                asChild
                size="md"
                preset="default"
                variant="outline"
                showArrow={false}
                aria-label={`Read more: ${blog.title}`}
                className="group/read-more gap-2 px-2 font-semibold"
              >
                <Link href="/blogs" prefetch>
                  <span>Read more</span>
                </Link>
              </CTAButton>
            </motion.div>

            {/* Focus ring for the card */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-sky-400/0 focus-within:ring-2 focus-within:ring-sky-400/50 dark:focus-within:ring-cyan-400/50" />
          </CardContent>
        </div>

        {/* Subtle border glow on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            borderColor: hovered ? "rgba(59, 130, 246, 0.45)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: easeSoft }}
          aria-hidden
        />
      </Card>
    </motion.article>
  );
});
BlogCard.displayName = "BlogCard";

/** ===================== Main Component ===================== */
const BlogSection: React.FC = React.memo(function BlogSection() {
  const reducedMotion = useReducedMotion();
  const t = useTranslations("BLOG_SECTION");

  const BLOGS: ReadonlyArray<Blog> = React.useMemo(
    () => ALL_BLOGS.slice(0, 3),
    []
  );

  return (
    <section
      aria-labelledby="blog-section-title"
      className={cn(
        "relative min-h-screen py-16 sm:py-20",
        "bg-gradient-to-br from-sky-50 via-white to-sky-50",
        "dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      )}
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
                "rounded-full px-4 py-2 text-sm font-medium backdrop-blur",
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
