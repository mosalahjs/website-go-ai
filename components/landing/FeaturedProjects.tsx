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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-16 font-bold mb-4 text-gradient-third">
            Featured <span className="">Projects</span>
          </h2>
          <p className="text-lg text-main-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful projects and innovative
            solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card
                variant={"shadow"}
                className="group py-0 border hover:border-blue-500"
              >
                {/* Top Gradient Header */}
                <div
                  className={`relative h-40 bg-gradient-to-br ${project.gradient} overflow-hidden rounded-t-xl`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <ExternalLink className="h-12 w-12 text-white/80" />
                  </motion.div>
                </div>

                {/* Card Content */}
                <CardContent className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gradient transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} className="badge-custom">
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
          <Button
            asChild
            size="lg"
            className="group relative rounded-full shadow-xl 
             bg-gradient-to-r from-blue-500 to-indigo-600 
             hover:from-indigo-600 hover:to-blue-500 
             dark:from-gray-700 dark:to-gray-900 
             dark:hover:from-gray-900 dark:hover:to-gray-700
             text-white transition-transform duration-300 
             hover:scale-105 overflow-hidden"
          >
            <Link href="/projects" className="flex items-center relative z-10">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              {/* Glow / ripple effect */}
              <span
                className="absolute inset-0 rounded-full 
                 bg-blue-500/30 dark:bg-gray-600/30
                 blur-xl opacity-50 animate-pulse pointer-events-none"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
