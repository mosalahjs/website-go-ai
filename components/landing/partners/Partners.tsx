"use client";

import React, { memo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Award, Sparkles } from "lucide-react";

import { PARTNERS } from "@/constant/partners";
import { cx } from "@/lib/ui/cx";
import { listVariants, itemVariants } from "./motionVariants";
import ParticlesField from "./ParticlesField";
import PartnerCard from "./PartnerCard";

const Partners: React.FC = () => {
  const t = useTranslations("Partners");
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className={cx("relative py-32 overflow-hidden")}
      aria-labelledby="partners-heading"
    >
      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />

      {/* Animated mesh gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={
          prefersReducedMotion
            ? undefined
            : { scale: [1, 1.2, 1], rotate: [0, 5, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          background:
            "radial-gradient(at 20% 30%, hsl(var(--primary)/0.15) 0px, transparent 50%), radial-gradient(at 80% 70%, hsl(var(--primary)/0.1) 0px, transparent 50%), radial-gradient(at 50% 50%, hsl(var(--accent)/0.1) 0px, transparent 50%)",
        }}
        aria-hidden
      />

      {/* Floating particles (seeded positions/durations) */}
      <ParticlesField count={15} seedKey="partners-section-v1" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={
              prefersReducedMotion ? undefined : { scale: 0, rotate: -180 }
            }
            whileInView={
              prefersReducedMotion ? undefined : { scale: 1, rotate: 0 }
            }
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-main border border-primary/20 mb-8 backdrop-blur-sm"
            aria-label={t("badge_label", { default: "Trusted partners" })}
          >
            <Award className="w-5 h-5 text-white" aria-hidden />
            <span className="text-sm font-bold text-white tracking-wide">
              {t("badge", { default: "TRUSTED PARTNERS" })}
            </span>
            <Sparkles
              className="w-4 h-4 text-white animate-pulse"
              aria-hidden
            />
          </motion.div>

          <h2
            id="partners-heading"
            className="text-5xl md:text-6xl font-bold mb-6 text-gradient-third leading-tight"
          >
            {t("title", { default: "Strategic Partnerships" })}
          </h2>
          <p className="text-xl text-main-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("subtitle", {
              default:
                "Partnering with leaders to co-build modern software and AI solutions—accelerating delivery, improving scalability, and delivering real business impact.",
            })}
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity }}
          className="max-w-7xl mx-auto"
        >
          <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {PARTNERS.map((partner) => (
              <motion.li
                key={partner.name}
                variants={itemVariants}
                className="h-full list-none"
              >
                <PartnerCard
                  partner={partner}
                  exploreLabel={t("explore", {
                    default: "EXPLORE PARTNERSHIP",
                  })}
                  establishedLabel={t("established", {
                    default: "Established",
                  })}
                  estPrefix={t("est_prefix", { default: "EST." })}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
            <motion.span
              className="w-3 h-3 rounded-full bg-primary"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.4, 1],
                      boxShadow: [
                        "0 0 0 0 hsl(var(--primary) / 0.7)",
                        "0 0 0 10px hsl(var(--primary) / 0)",
                        "0 0 0 0 hsl(var(--primary) / 0)",
                      ],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
              aria-hidden
            />
            <span className="text-base font-semibold text-foreground">
              {t("cta", { default: "Building the Future Together" })}
            </span>
            <Sparkles
              className="w-5 h-5 text-primary animate-pulse"
              aria-hidden
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Partners);
