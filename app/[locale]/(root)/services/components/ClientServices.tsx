"use client";

import React, { useEffect, useMemo, useState, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { CTAButton } from "@/components/ui/cta-button";
import { Link } from "@/i18n/routing";

/* -------------------- motion constants (out of render) -------------------- */
const heroVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};
const sectionFade = { initial: { opacity: 0 }, animate: { opacity: 1 } };
const cardHover = { scale: 1.05, rotateX: 3, rotateY: -3 } as const;
const cardTransition = { type: "spring", stiffness: 200, damping: 15 } as const;
const bgAnim1 = { x: [0, 30, -30, 0], y: [0, 20, -20, 0] };
const bgAnim2 = { x: [0, -40, 40, 0], y: [0, -30, 30, 0] };

/* ---------------------------- tiny memoized items --------------------------- */
type Service = { title: string; text: string };

const ServiceCard = memo(function ServiceCard({
  srv,
  reduced,
}: {
  srv: Service;
  reduced: boolean;
}) {
  return (
    <motion.div
      whileHover={reduced ? undefined : cardHover}
      transition={cardTransition}
      className="relative group p-8 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-lg border border-border/40 shadow-lg overflow-hidden text-center"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(29,78,216,0.25))",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 space-y-4">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
          {srv.title}
        </h2>
        <p className="text-muted-foreground">{srv.text}</p>
      </div>
    </motion.div>
  );
});

const ProcessStep = memo(function ProcessStep({
  step,
  reduced,
}: {
  step: string;
  reduced: boolean;
}) {
  return (
    <motion.li
      whileHover={reduced ? undefined : { scale: 1.05 }}
      className="p-6 rounded-2xl bg-card/50 border border-border shadow-md backdrop-blur-md"
    >
      <p className="font-medium">{step}</p>
    </motion.li>
  );
});

/* --------------------------------- page ---------------------------------- */
function ClientServices() {
  const t = useTranslations("Services");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const servicesList = useMemo(
    () => t.raw("servicesList") as { title: string; text: string }[],
    [t]
  );
  const processSteps = useMemo(() => t.raw("processSteps") as string[], [t]);

  const glow1 = useMemo(
    () =>
      theme === "dark"
        ? "radial-gradient(circle, rgba(37,99,235,0.35), transparent)"
        : "radial-gradient(circle, rgba(99,102,241,0.4), transparent)",
    [theme]
  );
  const glow2 = useMemo(
    () =>
      theme === "dark"
        ? "radial-gradient(circle, rgba(59,130,246,0.3), transparent)"
        : "radial-gradient(circle, rgba(59,130,246,0.3), transparent)",
    [theme]
  );

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      {/* Background animated glows */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full blur-3xl will-change-transform"
          style={{ background: glow1 }}
          animate={reduced ? undefined : bgAnim1}
          transition={
            reduced
              ? undefined
              : { duration: 15, repeat: Infinity, ease: "linear" }
          }
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl will-change-transform"
          style={{ background: glow2 }}
          animate={reduced ? undefined : bgAnim2}
          transition={
            reduced
              ? undefined
              : { duration: 20, repeat: Infinity, ease: "linear" }
          }
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 space-y-32">
        {/* HERO */}
        <motion.section
          variants={heroVariants}
          initial={reduced ? undefined : "initial"}
          animate="animate"
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
          aria-labelledby="services-hero-title"
        >
          <h1
            id="services-hero-title"
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-secondary-from to-secondary-to text-transparent bg-clip-text"
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </motion.section>

        {/* Services Grid */}
        <motion.section
          {...sectionFade}
          initial={reduced ? undefined : "initial"}
          whileInView="animate"
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-10% 0%" }}
          className="grid md:grid-cols-3 gap-8"
          aria-labelledby="services-grid-title"
        >
          <h2 id="services-grid-title" className="sr-only">
            {t("title", { default: "Our services" })}
          </h2>

          {servicesList.map((srv, i) => (
            <ServiceCard key={i} srv={srv} reduced={!!reduced} />
          ))}
        </motion.section>

        <motion.section
          variants={heroVariants}
          initial={reduced ? undefined : "initial"}
          whileInView="animate"
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-10% 0%" }}
          className="text-center space-y-6"
          aria-labelledby="process-title"
        >
          <h2
            id="process-title"
            className="text-4xl font-bold bg-gradient-to-r from-secondary-from to-secondary-to text-transparent bg-clip-text"
          >
            {t("processTitle")}
          </h2>
          <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t("processText")}
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {processSteps.map((step, i) => (
              <ProcessStep key={i} step={step} reduced={!!reduced} />
            ))}
          </ul>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          {...sectionFade}
          initial={reduced ? undefined : "initial"}
          whileInView="animate"
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 py-12"
          aria-labelledby="cta-title"
        >
          <h3
            id="cta-title"
            className="text-3xl font-semibold bg-gradient-to-r from-secondary-from to-secondary-to text-transparent bg-clip-text"
          >
            {t("ctaTitle")}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("ctaText")}
          </p>
          <CTAButton
            asChild
            size="lg"
            showArrow
            sheen
            className="rounded-full px-6 py-3 font-semibold shadow-lg hover:shadow-xl inline-block mt-6"
          >
            {t("ctaButton")}
            <Link href="/contact" aria-label={t("ctaButton")} />
          </CTAButton>
        </motion.section>
      </div>
    </div>
  );
}

export default memo(ClientServices);
