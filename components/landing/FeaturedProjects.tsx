"use client";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

const projects = [
  {
    id: 1,
    title: "SmartDocs AI",
    description:
      "Intelligent document processing platform with NLP capabilities for automated data extraction.",
    tags: ["AI/ML", "Next.js", "Python"],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    title: "FinTech Dashboard",
    description:
      "Real-time financial analytics platform with advanced data visualization and reporting.",
    tags: ["React", "Node.js", "PostgreSQL"],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description:
      "Scalable multi-vendor marketplace with AI-powered recommendations and inventory management.",
    tags: ["Next.js", "Stripe", "MongoDB"],
    gradient: "from-indigo-500 to-purple-500",
  },
];

export function FeaturedProjects() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Featured <span className="main-gradient-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful projects and innovative
            solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card className="group h-full border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-card overflow-hidden">
                <div
                  className={`relative aspect-[16/9] bg-gradient-to-br ${project.gradient}  overflow-hidden`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <ExternalLink className="h-12 w-12 text-white/80" />
                  </motion.div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
