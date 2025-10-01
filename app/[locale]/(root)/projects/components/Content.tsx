"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const categories = ["All", "AI/ML", "Web", "Mobile", "SaaS"];

const projects = [
  {
    id: 1,
    title: "SmartDocs AI",
    description:
      "Intelligent document processing platform with NLP for automated data extraction and classification.",
    category: "AI/ML",
    tags: ["AI/ML", "Next.js", "Python", "FastAPI"],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    title: "FinTech Dashboard",
    description:
      "Real-time financial analytics with advanced visualization and portfolio management.",
    category: "Web",
    tags: ["React", "Node.js", "PostgreSQL", "D3.js"],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description:
      "Multi-vendor marketplace with AI recommendations and inventory management.",
    category: "SaaS",
    tags: ["Next.js", "Stripe", "MongoDB", "Redis"],
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: 4,
    title: "Healthcare Portal",
    description:
      "Patient management system with telemedicine and appointment scheduling.",
    category: "Web",
    tags: ["React", "Node.js", "MySQL", "WebRTC"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "AI Chatbot Platform",
    description:
      "Conversational AI platform with custom training and multi-channel deployment.",
    category: "AI/ML",
    tags: ["Python", "TensorFlow", "React", "AWS"],
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 6,
    title: "Mobile Fitness App",
    description:
      "Personalized workout tracking with AI-powered form correction and nutrition planning.",
    category: "Mobile",
    tags: ["React Native", "Firebase", "TensorFlow Lite"],
    gradient: "from-rose-500 to-orange-500",
  },
];

export default function Content() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-third">
              Our <span className="">Projects</span>
            </h1>
            <p className="text-xl text-main-muted-foreground">
              Explore our portfolio of successful projects across various
              industries and technologies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-main" : ""}
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    variant={"shadow"}
                    className="group py-0 border hover:border-blue-500"
                  >
                    <div
                      className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}
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
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
