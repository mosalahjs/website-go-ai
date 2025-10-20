"use client";
import React, { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { seededRng, randBetween } from "@/lib/random/seeded";
import { Partner } from "@/types/partners";

interface PartnerCardProps {
  partner: Partner;
  exploreLabel: string;
  establishedLabel: string;
  estPrefix: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
  partner,
  exploreLabel,
  establishedLabel,
  estPrefix,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Seeded ambient specks — stable across SSR/CSR
  const specks = useMemo(() => {
    const r = seededRng(`specks:${partner.name}`);
    return Array.from({ length: 5 }).map((_, i) => ({
      x1: randBetween(r, 0, 100),
      x2: randBetween(r, 0, 100),
      y1: randBetween(r, 0, 100),
      y2: randBetween(r, 0, 100),
      delay: i * 0.3,
      duration: randBetween(r, 3, 5),
    }));
  }, [partner.name]);

  // Link helpers
  const href = partner.exploreUrl ?? "#";
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <motion.div
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02, z: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full [perspective:1000px]"
    >
      <Card
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-2xl border-0 h-full flex flex-col shadow-2xl hover:shadow-[0_0_60px_-15px] transition-all duration-700"
        style={{ boxShadow: `0 10px 40px -10px ${partner.bgGlow}` }}
      >
        {/* Hover overlays & animated borders */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `linear-gradient(135deg, ${partner.gradientFrom}26, ${partner.gradientTo}26)`,
          }}
          aria-hidden
        />
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${partner.gradientFrom}, ${partner.gradientTo})`,
            padding: 1,
            borderRadius: "inherit",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor" as unknown as string, // ← تم تعديل الـ casting هنا
            maskComposite: "exclude",
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : { backgroundPosition: ["0% 0%", "100% 100%"] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, repeatType: "reverse" }
          }
          aria-hidden
        />
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${partner.accentColor}40, transparent)`,
          }}
          animate={prefersReducedMotion ? undefined : { x: ["-100%", "200%"] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2, repeat: Infinity, repeatDelay: 1 }
          }
          aria-hidden
        />

        <CardContent className="p-0 relative z-10 flex flex-col h-full">
          {/* Media */}
          <div className="relative h-80 flex items-center justify-center overflow-hidden rounded-t-3xl bg-gradient-to-br from-muted/30 to-muted/10">
            {partner.logo ? (
              <motion.div
                className="relative w-full h-full flex items-center justify-center p-12"
                whileHover={
                  prefersReducedMotion ? undefined : { scale: 1.06, rotate: 2 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className="absolute inset-0 opacity-20 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${partner.accentColor}, transparent 70%)`,
                  }}
                  aria-hidden
                />
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain drop-shadow-2xl"
                  priority={false}
                />
              </motion.div>
            ) : (
              <motion.div
                className="absolute inset-0"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {partner.image && (
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                )}
                <div
                  className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${partner.gradientFrom}20 50%, ${partner.gradientTo}50 100%)`,
                  }}
                  aria-hidden
                />
              </motion.div>
            )}

            {/* Year badge */}
            <motion.div
              className="absolute top-6 right-6 px-4 py-2 rounded-2xl backdrop-blur-xl border-2"
              style={{
                backgroundColor: partner.bgGlow,
                borderColor: partner.accentColor,
                boxShadow: `0 0 20px ${partner.bgGlow}`,
              }}
              whileHover={
                prefersReducedMotion ? undefined : { scale: 1.08, rotate: -2 }
              }
              animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              aria-label={establishedLabel}
            >
              <span
                className="text-sm font-black tracking-wider"
                style={{ color: partner.accentColor }}
              >
                {estPrefix} {partner.year}
              </span>
            </motion.div>

            {/* Bottom glow line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${partner.accentColor}, transparent)`,
              }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { scaleX: [0, 1, 0], opacity: [0, 1, 0] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2, repeat: Infinity, repeatDelay: 1 }
              }
              aria-hidden
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-5 flex flex-col flex-grow relative">
            {/* Ambient background specks */}
            <div
              className="absolute inset-0 overflow-hidden opacity-30"
              aria-hidden
            >
              {specks.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: partner.accentColor,
                    left: `${s.x1}%`,
                    top: `${s.y1}%`,
                  }}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          left: [`${s.x1}%`, `${s.x2}%`],
                          top: [`${s.y1}%`, `${s.y2}%`],
                          opacity: [0, 1, 0],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : {
                          duration: s.duration,
                          repeat: Infinity,
                          delay: s.delay,
                        }
                  }
                />
              ))}
            </div>

            <div className="space-y-3 relative z-10">
              <motion.h3
                className="text-4xl font-black tracking-tight relative inline-block"
                whileHover={
                  prefersReducedMotion ? undefined : { scale: 1.03, x: 6 }
                }
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${partner.gradientFrom}, ${partner.gradientTo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {partner.name}
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 rounded-full block"
                  style={{
                    background: `linear-gradient(90deg, ${partner.gradientFrom}, ${partner.gradientTo})`,
                  }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  aria-hidden
                />
              </motion.h3>
            </div>

            <div className="flex items-center gap-3">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: partner.accentColor }}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        scale: [1, 1.5, 1],
                        boxShadow: [
                          `0 0 0 0 ${partner.accentColor}`,
                          `0 0 0 8px ${partner.accentColor}00`,
                          `0 0 0 0 ${partner.accentColor}`,
                        ],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 2, repeat: Infinity }
                }
                aria-hidden
              />
              <h4 className="text-lg font-bold text-foreground/90">
                {partner.title}
              </h4>
            </div>

            <p className="text-muted-foreground leading-relaxed flex-grow text-base">
              {partner.description}
            </p>

            <motion.div
              className="flex items-center gap-2 pt-4"
              whileHover={prefersReducedMotion ? undefined : { x: 8 }}
            >
              <Link
                href={href}
                prefetch={false}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                aria-label={exploreLabel}
                className="inline-flex items-center cursor-pointer pointer-events-auto relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              >
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{ color: partner.accentColor }}
                >
                  {exploreLabel}
                </span>
              </Link>

              <Link
                href={href}
                prefetch={false}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                aria-label={exploreLabel}
                className="inline-flex items-center cursor-pointer pointer-events-auto relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              >
                <motion.span
                  animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 1.5, repeat: Infinity }
                  }
                >
                  <ExternalLink
                    className="w-4 h-4"
                    style={{ color: partner.accentColor }}
                    aria-hidden
                  />
                </motion.span>
              </Link>
            </motion.div>
            {/* end change */}
          </div>

          {/* Corners */}
          <motion.div
            className="absolute top-0 left-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at top left, ${partner.accentColor}40, transparent 70%)`,
            }}
            aria-hidden
          />
          <motion.div
            className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at bottom right, ${partner.accentColor}40, transparent 70%)`,
            }}
            aria-hidden
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(PartnerCard);
