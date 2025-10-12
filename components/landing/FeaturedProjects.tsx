"use client";
import { memo, useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/cta-button";
import { projectsData } from "@/constant/Projects";
import { ProjectMediaCTA } from "../shared/ProjectMediaCTA";
import { TagPill } from "@/components/ui/tag-pill";

function FeaturedProjectsComponent() {
  const reducedMotion = useReducedMotion();
  const items = useMemo(() => projectsData.slice(0, 3), []);

  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: EASE_OUT },
    }),
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-500">
            Featured <span className="text-blue-500">Projects</span>
          </h2>
          <p className="text-lg text-blue-400/80 max-w-2xl mx-auto">
            Explore our portfolio of successful projects and innovative
            solutions
          </p>
        </motion.header>

        {/* Project Cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {items.map((p, index) => (
            <motion.div
              key={p.id}
              custom={index}
              variants={fadeInUp}
              initial={reducedMotion ? undefined : "hidden"}
              whileInView={reducedMotion ? undefined : "visible"}
              viewport={{ once: true }}
            >
              <Card
                variant="shadow"
                className={[
                  "group relative border border-border/40 rounded-2xl overflow-hidden",
                  "transition-all duration-500 will-change-transform",
                  reducedMotion ? "" : "hover:-translate-y-1",
                  "shadow-sm hover:shadow-[0_18px_50px_-15px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_18px_50px_-18px_rgba(99,102,241,0.35)]",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
                  "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                  "before:bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(99,102,241,0.12),transparent_60%)]",
                ].join(" ")}
              >
                {/* Reusable Project Image + CTA Section */}
                <ProjectMediaCTA
                  src={p.image}
                  alt={p.title}
                  title={p.title}
                  demoHref={p.demoLink}
                  detailsHref={`/projects/${p.id}`}
                  demoLabel="View Demo"
                  detailsLabel="View Details"
                  index={index}
                  priorityFirst={2}
                  ctaSize="md"
                  heightClass="h-48"
                  className="rounded-t-2xl"
                />

                {/* Card Body */}
                <CardContent className="p-6 space-y-4">
                  <Link
                    href={`/projects/${p.id}`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded"
                    prefetch={false}
                  >
                    <h3 className="text-xl font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((tag) => (
                      <TagPill
                        key={tag}
                        label={tag}
                        size="sm"
                        from="#3479fe"
                        to="#4898ff"
                        fromDark="#222834"
                        toDark="#343f4f"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0 }}
          whileInView={reducedMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <CTAButton asChild size="lg" className="group">
            <Link href="/projects" className="flex items-center justify-center">
              View All Projects
            </Link>
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}

export const FeaturedProjects = memo(FeaturedProjectsComponent);
export default FeaturedProjects;
