"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc",
    content:
      "Go Ai 247 transformed our business with their innovative AI solutions. The team's expertise and dedication exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CTO, DataFlow Systems",
    content:
      "Outstanding work on our enterprise platform. Their technical skills and project management were top-notch from start to finish.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, SmartRetail",
    content:
      "The AI integration they delivered has increased our efficiency by 40%. Highly recommend their services for any serious tech project.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Client <span className="main-gradient-primary">Testimonials</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our satisfied
            clients
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="will-change-transform"
            >
              <Card className="h-full border bg-card/50 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                <CardContent className="p-6 space-y-4 relative z-10">
                  <Quote className="h-8 w-8 text-gradient-third" />
                  <p className="text-muted-foreground leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="pt-4 border-t border-border/40">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
