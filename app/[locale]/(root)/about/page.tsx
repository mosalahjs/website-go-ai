"use client";
import { motion } from "framer-motion";
import { Target, Users, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/shared/Container";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're committed to delivering cutting-edge AI and software solutions that drive real business value.",
  },
  {
    icon: Users,
    title: "Client-Focused",
    description:
      "Your success is our success. We work closely with you to understand and exceed your expectations.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We stay ahead of technology trends to provide you with the most advanced solutions available.",
  },
  {
    icon: TrendingUp,
    title: "Growth Partners",
    description:
      "We don't just build software - we help scale your business through strategic technology adoption.",
  },
];

const timeline = [
  { year: "2020", event: "Company Founded" },
  { year: "2021", event: "First AI Integration Project" },
  { year: "2022", event: "Expanded to 20+ Team Members" },
  { year: "2023", event: "50+ Successful Projects Delivered" },
  { year: "2024", event: "Global Client Base Established" },
];

export default function About() {
  return (
    <Container>
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-third">
                About <span className="">Go AI 247</span>
              </h1>
              <p className="text-xl text-main-muted-foreground">
                We&apos;re a team of passionate technologists, designers, and
                strategists dedicated to transforming businesses through AI and
                innovative software solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-main">
                  Our Story
                </h2>
                <div className="space-y-4 text-main-muted-foreground leading-relaxed">
                  <p>
                    Founded in 2020, Go Ai 247 started with a simple mission:
                    make enterprise-grade AI and software development accessible
                    to businesses of all sizes.
                  </p>
                  <p>
                    What began as a small team of developers has grown into a
                    full-service technology consultancy. We&apos;ve helped
                    dozens of companies leverage cutting-edge technologies to
                    solve complex business challenges.
                  </p>
                  <p>
                    Today, we&apos;re proud to work with clients across
                    industries, from startups to Fortune 500 companies,
                    delivering solutions that drive measurable results.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <div className="space-y-4">
                    {timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border/40"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-main flex items-center justify-center text-white dark:text-black font-bold">
                          {item.year}
                        </div>
                        <div className="text-lg font-medium">{item.event}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gradient-third">
                Our <span className="">Values</span>
              </h2>
              <p className="text-lg text-main-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-card">
                    <CardContent className="p-6 space-y-4">
                      <div className="inline-flex p-3 rounded-xl bg-primary/10">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}
