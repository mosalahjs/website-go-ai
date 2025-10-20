"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/ui/cta-button";

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

/** ===================== Utils ===================== */
const categoriesFromData = (blogs: ReadonlyArray<Blog>) => {
  const set = new Set<string>(["All"]);
  blogs.forEach((b) => set.add(b.category));
  return Array.from(set);
};

/** ===================== Blog Card ===================== */
const BlogCard = React.memo(function BlogCard({
  blog,
  index,
}: {
  blog: Blog;
  index: number;
}) {
  const reduced = useReducedMotion();
  const [imgError, setImgError] = React.useState(false);

  const sizes = "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06, duration: reduced ? 0 : 0.5 }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden group transition-all duration-300",
          "border border-border bg-background/40 backdrop-blur-md hover:shadow-2xl hover:border-primary/40",
          "card-custom"
        )}
      >
        <div className="relative h-52 overflow-hidden">
          {!imgError ? (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes={sizes}
              priority={false}
              loading="lazy"
              onError={() => setImgError(true)}
              className={cn(
                "object-cover",
                !reduced && "transition-transform duration-500",
                "group-hover:scale-110"
              )}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--primary-from),transparent_40%),radial-gradient(circle_at_70%_70%,var(--secondary-from),transparent_45%)] opacity-70 animate-gradient-spin" />
          )}
          <div className="absolute top-4 left-4">
            {/* بادج بنفس روح CTA badge في Projects */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-from to-primary-to text-white backdrop-blur-sm border border-primary/20 text-xs font-medium">
              {blog.category}
            </span>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          {/* عنوان بنفس تدرّج عناوين Projects */}
          <h3 className="text-xl font-semibold leading-14 bg-clip-text text-transparent bg-gradient-to-r from-secondary-from to-secondary-to line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {blog.excerpt}
          </p>

          <div className="flex flex-wrap gap-2" aria-label="tags">
            {blog.tags.map((tag) => (
              <span
                key={`${blog.id}-${tag}`}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
              >
                <Tag className="h-3 w-3" aria-hidden />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
BlogCard.displayName = "BlogCard";

/** ===================== Page Component ===================== */
export default function BlogsPage() {
  const t = useTranslations("BLOG_PAGE");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => categoriesFromData(ALL_BLOGS), []);
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_BLOGS.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      if (!q) return matchesCategory;
      const matchesSearch =
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.tags.some((tg) => tg.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ background: "var(--background-gradient-primary)" }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-16 bg-clip-text text-transparent bg-gradient-to-r from-secondary-from to-secondary-to">
              {t("title_prefix")} {t("title_core")}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              {t("subtitle")}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto" role="search">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                inputMode="search"
                aria-label={t("search_aria")}
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background/60 backdrop-blur-sm border-border/40"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reduced ? 0 : 0.6,
              delay: reduced ? 0 : 0.2,
            }}
            className="flex flex-wrap gap-3 justify-center"
            role="tablist"
            aria-label={t("categories_aria")}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const label = category === "All" ? t("all") : category;

              return (
                <CTAButton
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "rounded-full px-6 py-2 text-sm font-medium transition-all",
                    isSelected ? "scale-105 shadow-lg" : "hover:scale-105"
                  )}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  aria-label={`Filter by ${label}`}
                  sheen
                  glowFrom="rgba(52,121,254,0.45)"
                  glowTo="rgba(72,152,255,0.45)"
                  showArrow={false}
                  size="md"
                >
                  {label}
                </CTAButton>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-16"
              role="status"
              aria-live="polite"
            >
              <p className="text-lg text-muted-foreground">{t("empty")}</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
