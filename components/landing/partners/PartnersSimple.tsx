"use client";
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { nameToKey, PARTNERS_SIMPLE } from "@/constant/partners";

const MotionImage = motion.create(Image);

export const PartnersSimple = memo(function Partners() {
  const t = useTranslations("PARTNERS_SIMPLE");
  const prefersReducedMotion = useReducedMotion();

  const appear = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.5 },
  } as const;

  return (
    <section
      className="relative py-24 overflow-hidden"
      aria-labelledby="partners-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={appear.initial}
          whileInView={appear.whileInView}
          viewport={{ once: true }}
          transition={appear.transition}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  bg-gradient-to-r from-primary-from to-primary-to border border-primary/20 mb-6">
            <Award className="size-4 text-white" aria-hidden />
            <span className="text-sm font-semibold text-white">
              {t("badge")}
            </span>
          </div>

          <h2
            id="partners-heading"
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient-third leading-16"
          >
            {t("heading")}
          </h2>
          <p className="text-lg text-main-muted-foreground max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.2,
          }}
          className=" mx-auto"
          aria-roledescription="carousel"
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {PARTNERS_SIMPLE.map((partner, index) => {
                const key = nameToKey[partner.name];
                const name = key
                  ? t(`items.${key}.name`, { default: partner.name })
                  : partner.name;
                const title = key
                  ? t(`items.${key}.title`, { default: partner.title })
                  : partner.title;
                const description = key
                  ? t(`items.${key}.description`, {
                      default: partner.description,
                    })
                  : partner.description;

                return (
                  <CarouselItem
                    key={partner.name}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      initial={appear.initial}
                      whileInView={appear.whileInView}
                      viewport={{ once: true }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.5,
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                      }}
                      className="h-full"
                    >
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                        aria-label={`${name} – ${t("visit")}`}
                      >
                        <Card className="group relative overflow-hidden border-2 hover:border-border-primary transition-all duration-300 h-full hover:shadow-lg flex flex-col">
                          <CardContent className="p-0 flex-1 flex flex-col">
                            <div
                              className="relative h-64 flex items-center justify-center overflow-hidden"
                              style={{ background: partner.logoBg }}
                            >
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-3xl"
                                style={{
                                  background: `radial-gradient(circle, ${partner.accentColor}, transparent 70%)`,
                                }}
                                aria-hidden
                              />
                              <div className="absolute inset-0 p-10">
                                <MotionImage
                                  src={partner.logo as StaticImageData}
                                  alt={`${name} logo`}
                                  fill
                                  sizes="(max-width: 768px) 75vw, (max-width: 1024px) 33vw, 25vw"
                                  className="object-contain"
                                  priority={index === 0}
                                  loading={index === 0 ? "eager" : "lazy"}
                                  decoding="async"
                                  whileHover={{
                                    scale: prefersReducedMotion ? 1 : 1.05,
                                  }}
                                  transition={{
                                    duration: prefersReducedMotion ? 0 : 0.3,
                                  }}
                                />
                              </div>

                              {/* Year Badge */}
                              <div
                                className="absolute top-4 right-4 px-3 py-1 rounded-lg backdrop-blur-sm text-xs font-bold"
                                style={{
                                  backgroundColor: `${partner.bgGlow}`,
                                  borderColor: partner.accentColor,
                                  color: partner.accentColor,
                                  border: `1px solid ${partner.accentColor}`,
                                }}
                                aria-label={`Year ${partner.year}`}
                              >
                                {partner.year}
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="p-6 flex flex-col gap-3 flex-1">
                              <h3
                                className="text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1 line-clamp-1"
                                style={{
                                  background: `linear-gradient(135deg, ${partner.gradientFrom}, ${partner.gradientTo})`,
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }}
                              >
                                {name}
                              </h3>

                              <h4 className="text-sm font-semibold text-muted-foreground line-clamp-1">
                                {title}
                              </h4>

                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5 min-h-[6.5rem]">
                                {description}
                              </p>

                              <div className="mt-auto pt-2">
                                <span
                                  className="text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                                  style={{ color: partner.accentColor }}
                                >
                                  {t("visit")}
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                );
              })}
            </CarouselContent>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious
                className="static translate-y-0 cursor-pointer size-10"
                aria-label={t("prev")}
              />
              <CarouselNext
                className="static translate-y-0 cursor-pointer size-10"
                aria-label={t("next")}
              />
            </div>
          </Carousel>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={appear.initial}
          whileInView={appear.whileInView}
          viewport={{ once: true }}
          transition={{
            delay: prefersReducedMotion ? 0 : 0.4,
            duration: prefersReducedMotion ? 0 : 0.5,
          }}
          className="mt-16 text-center"
        >
          <p className="text-main-muted-foreground">{t("footer")}</p>
        </motion.div>
      </div>
    </section>
  );
});

export default PartnersSimple;
