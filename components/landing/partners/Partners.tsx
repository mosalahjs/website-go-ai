"use client";

import React, { JSX, memo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/* ============================
   Types
   ============================ */
type Partner = {
  name: string;
  title: string;
  description: string;
  logo: string;
  image: null | string;
  gradientFrom: string;
  gradientTo: string;
  bgGlow: string;
  accentColor: string;
  year: string;
  link: string;
  logoBg: string;
};

/* ============================
   Data (immutable)
   ============================ */
const PARTNERS: ReadonlyArray<Partner> = [
  {
    name: "e&",
    title: "Leading Telecommunications Provider",
    description:
      "Pioneering next-generation digital connectivity and innovative telecommunication solutions across the Middle East region with cutting-edge 5G technology and smart infrastructure.",
    logo: "/assets/partner-eand-logo.svg",
    image: null,
    gradientFrom: "#E31E24",
    gradientTo: "#B71C1C",
    bgGlow: "rgba(227, 30, 36, 0.15)",
    accentColor: "rgb(227, 30, 36)",
    year: "2024",
    link: "https://www.eand.com",
    logoBg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
  },
  {
    name: "Forbes Middle East",
    title: "Premier Business Publication",
    description:
      "The region's most authoritative voice in business journalism, showcasing influential leaders, groundbreaking innovations, and transformative companies shaping the Middle East economy.",
    logo: "/assets/partner-forbes-logo.svg",
    image: null,
    gradientFrom: "#D4AF37",
    gradientTo: "#C9A227",
    bgGlow: "rgba(212, 175, 55, 0.15)",
    accentColor: "rgb(212, 175, 55)",
    year: "2025",
    link: "https://www.forbesmiddleeast.com",
    logoBg: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
  },
  {
    name: "The First Group",
    title: "Luxury Hospitality Excellence",
    description:
      "Defining luxury in the hospitality sector with world-class hotel properties, exquisite dining experiences, and unparalleled service standards that set new benchmarks in premium hospitality.",
    logo: "/assets/partner-tfg-logo.png",
    image: null,
    gradientFrom: "#B8976A",
    gradientTo: "#8B7355",
    bgGlow: "rgba(184, 151, 106, 0.15)",
    accentColor: "rgb(184, 151, 106)",
    year: "2023",
    link: "https://www.thefirstgroup.com",
    logoBg: "linear-gradient(135deg, #0f0f0f, #1f1f1f)",
  },
] as const;

/* ============================
   Motion helpers
   ============================ */
const MotionImage = motion.create(Image);

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = (i: number, rm: boolean): Variants => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: rm ? 0 : 0.5, delay: rm ? 0 : i * 0.1 },
  },
});

/* ============================
   Component
   ============================ */
function PartnersComponent(): JSX.Element {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Award className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold text-primary">
              TRUSTED PARTNERS
            </span>
          </div>

          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Strategic Partnerships
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Collaborating with industry leaders to drive innovation
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.2 }}
          className="mx-auto max-w-6xl"
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {PARTNERS.map((partner, index) => (
                <CarouselItem
                  key={partner.name}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    variants={cardVariants(index, !!reduced)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                      aria-label={`${partner.name} – Visit Website`}
                    >
                      <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                        <CardContent className="p-0">
                          {/* Logo area */}
                          <div
                            className="relative flex h-64 items-center justify-center overflow-hidden"
                            style={{ background: partner.logoBg }}
                          >
                            {/* Subtle glow */}
                            <div
                              className="absolute inset-0 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                              style={{
                                background: `radial-gradient(circle, ${partner.accentColor}, transparent 70%)`,
                              }}
                              aria-hidden
                            />

                            {/* Logo (Next/Image + motion) */}
                            <div className="absolute inset-0 p-8">
                              <MotionImage
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="object-contain"
                                fill
                                sizes="(max-width: 768px) 75vw, (max-width: 1024px) 33vw, 25vw"
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                                whileHover={reduced ? {} : { scale: 1.05 }}
                                transition={{ duration: reduced ? 0 : 0.3 }}
                              />
                            </div>
                          </div>

                          {/* Text content */}
                          <div className="space-y-3 p-6">
                            <h3
                              className="text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1"
                              style={{
                                background: `linear-gradient(135deg, ${partner.gradientFrom}, ${partner.gradientTo})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              }}
                            >
                              {partner.name}
                            </h3>

                            <h4 className="text-sm font-semibold text-muted-foreground">
                              {partner.title}
                            </h4>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {partner.description}
                            </p>

                            <div className="pt-2">
                              <span
                                className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2"
                                style={{ color: partner.accentColor }}
                              >
                                Visit Website
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduced ? 0 : 0.4, duration: reduced ? 0 : 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">Building the Future Together</p>
        </motion.div>
      </div>
    </section>
  );
}

export const Partners = memo(PartnersComponent);
