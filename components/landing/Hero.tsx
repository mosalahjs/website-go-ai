"use client";
import { memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition, Transition } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/public/assets/hero-coding.jpg";
import { Button } from "@/components/ui/button";
import Container from "../shared/Container";
import { Link } from "@/i18n/routing";
import { WEBSITE_NAME } from "@/constant";
import { CTAButton } from "../ui/cta-button";

// =====================
// Motion constants (stable refs to avoid re-creation each render)
// =====================
export const FLOAT_PRIMARY_ANIMATE = {
  x: [0, 100, 0],
  y: [0, -100, 0],
  scale: [1, 1.2, 1],
  opacity: [0.4, 0.6, 0.4],
} satisfies TargetAndTransition;

export const FLOAT_PRIMARY_TRANSITION: Transition = {
  duration: 12,
  repeat: Infinity,
  ease: "easeInOut",
};

export const FLOAT_SECONDARY_ANIMATE = {
  x: [0, -100, 0],
  y: [0, 100, 0],
  scale: [1, 1.4, 1],
  opacity: [0.3, 0.5, 0.3],
} satisfies TargetAndTransition;

export const FLOAT_SECONDARY_TRANSITION: Transition = {
  duration: 15,
  repeat: Infinity,
  ease: "easeInOut",
  delay: 2,
};

export const FLOAT_ACCENT_ANIMATE = {
  x: [0, 50, 0],
  y: [0, -50, 0],
  scale: [1, 1.3, 1],
  opacity: [0.2, 0.4, 0.2],
} satisfies TargetAndTransition;

export const FLOAT_ACCENT_TRANSITION: Transition = {
  duration: 10,
  repeat: Infinity,
  ease: "easeInOut",
  delay: 4,
};

export const CARD_FLOAT_ANIMATE = {
  y: [0, -30, 0],
  rotateY: [0, 5, 0],
} satisfies TargetAndTransition;

export const CARD_FLOAT_TRANSITION: Transition = {
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut",
};

// helper: respect prefers-reduced-motion
const maybeAnimate = (
  reduce: boolean,
  animate: Record<string, any> | undefined
) => (reduce ? undefined : animate);
const maybeTransition = (
  reduce: boolean,
  transition: Record<string, any> | undefined
) => (reduce ? undefined : transition);

function HeroComponent() {
  const t = useTranslations("landingPage");
  const reduce = !!useReducedMotion();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-mesh z-10"
          aria-hidden="true"
        />
        {/* Decorative background image is presentational */}
        <Image
          src={heroImage}
          alt=""
          role="presentation"
          aria-hidden
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover opacity-40 dark:opacity-20"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-10"
          aria-hidden="true"
        />
      </div>

      <Container className="">
        {/* Animated background elements */}
        <div
          className="absolute inset-0 overflow-hidden z-20"
          aria-hidden="true"
        >
          <motion.div
            animate={maybeAnimate(reduce, FLOAT_PRIMARY_ANIMATE)}
            transition={maybeTransition(reduce, FLOAT_PRIMARY_TRANSITION)}
            className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl will-change-transform"
          />
          <motion.div
            animate={maybeAnimate(reduce, FLOAT_SECONDARY_ANIMATE)}
            transition={maybeTransition(reduce, FLOAT_SECONDARY_TRANSITION)}
            className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl will-change-transform"
          />
          <motion.div
            animate={maybeAnimate(reduce, FLOAT_ACCENT_ANIMATE)}
            transition={maybeTransition(reduce, FLOAT_ACCENT_TRANSITION)}
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl will-change-transform"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl text-center mx-auto font-bold bg-clip-text text-transparent text-gradient-third"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {WEBSITE_NAME}
                </motion.h1>
                {/* Keep visual h3 but correct heading semantics for SRs */}
                <motion.h3
                  role="heading"
                  aria-level={2}
                  className="text-lg md:text-xl font-semibold text-center mt-4 mb-6 bg-clip-text text-transparent text-gradient-third dark:from-[#8E969B] dark:to-[#525456]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                  {t("description")}
                </motion.h3>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4"
              >
                <CTAButton asChild size="lg">
                  <Link href="/contact">{t("getStarted")}</Link>
                </CTAButton>
                <CTAButton
                  asChild
                  size="lg"
                  showArrow={false}
                  variant="outline"
                >
                  <Link href="/projects">{t("viewProjects")}</Link>
                </CTAButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center justify-center space-x-8 pt-4"
              >
                {/* Use definition list for better semantics without visual change */}
                <dl className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <dt className="sr-only">{t("Projects Delivered")}</dt>
                    <dd>
                      <div className="text-3xl font-bold text-main">50+</div>
                      <div className="text-sm text-main-muted-foreground">
                        {t("Projects Delivered")}
                      </div>
                    </dd>
                  </div>
                  <div className="text-center">
                    <dt className="sr-only">{t("Client Satisfaction")}</dt>
                    <dd>
                      <div className="text-3xl font-bold text-main">98%</div>
                      <div className="text-sm text-main-muted-foreground">
                        {t("Client Satisfaction")}
                      </div>
                    </dd>
                  </div>
                  <div className="text-center">
                    <dt className="sr-only">{t("Support")}</dt>
                    <dd>
                      <div className="text-3xl font-bold text-main">24/7</div>
                      <div className="text-sm text-main-muted-foreground">
                        {t("Support")}
                      </div>
                    </dd>
                  </div>
                </dl>
              </motion.div>
            </motion.div>

            {/* Right section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative lg:block hidden"
            >
              <motion.div
                animate={maybeAnimate(reduce, CARD_FLOAT_ANIMATE)}
                transition={maybeTransition(reduce, CARD_FLOAT_TRANSITION)}
                className="relative rounded-3xl overflow-hidden shadow-intense border-4 border-main-muted-foreground/20 will-change-transform"
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                aria-hidden="true"
              >
                <div
                  className="absolute inset-0 bg-gradient-primary opacity-20 mix-blend-overlay z-10"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 z-10"
                  aria-hidden="true"
                />
                <Image
                  src={heroImage}
                  alt="AI Technology Workspace"
                  className="w-full h-auto rounded-3xl"
                  sizes="(min-width:1024px) 560px, 100vw"
                  placeholder="blur"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"
                  aria-hidden="true"
                />
              </motion.div>
              {/* Decorative element */}
              <motion.div
                animate={maybeAnimate(reduce, { rotate: [0, 360] })}
                transition={maybeTransition(reduce, {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                })}
                className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-primary opacity-20 rounded-full blur-2xl -z-10 will-change-transform"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

HeroComponent.displayName = "HeroComponent";

export const Hero = memo(HeroComponent);
