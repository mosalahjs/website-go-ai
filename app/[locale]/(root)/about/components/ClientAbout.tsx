"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState, memo } from "react";

/* ---------- Main Component ---------- */
function ClientAbout() {
  const t = useTranslations("AboutPage");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(88,28,135,0.4), transparent)"
                : "radial-gradient(circle, rgba(99,102,241,0.4), transparent)",
          }}
          animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(236,72,153,0.3), transparent)"
                : "radial-gradient(circle, rgba(59,130,246,0.3), transparent)",
          }}
          animate={{ x: [0, -40, 40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 space-y-32">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("intro")}
          </p>
        </motion.section>

        {/* Vision / Mission */}
        <SectionGrid
          items={[
            { title: t("visionTitle"), text: t("visionText") },
            { title: t("missionTitle"), text: t("missionText") },
          ]}
        />

        {/* Core Values */}
        <ValuesSection t={t} />

        {/* Strengths */}
        <ExtraSection
          title={t("strengthsTitle")}
          paragraphs={t.raw("strengthsList") as string[]}
        />

        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl font-bold">{t("storyTitle")}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.section>

        {/* Technology & Security */}
        <ExtraSection
          title={t("techTitle")}
          paragraphs={t.raw("techPoints") as string[]}
        />

        {/* Value Proposition */}
        <ExtraSection
          title={t("valueTitle")}
          paragraphs={t.raw("valuePoints") as string[]}
        />

        {/* Metrics */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {(t.raw("metrics") as { number: string; label: string }[]).map(
            (m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border rounded-3xl backdrop-blur-md text-center shadow-sm"
              >
                <h3 className="text-3xl font-bold text-primary">{m.number}</h3>
                <p className="text-muted-foreground mt-2">{m.label}</p>
              </motion.div>
            )
          )}
        </motion.section>
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

interface SectionItem {
  title: string;
  text: string;
}

const SectionGrid = memo(function SectionGrid({
  items,
}: {
  items: SectionItem[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-8"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{
            scale: 1.05,
            rotateX: 3,
            rotateY: -3,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative group p-8 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-lg border border-border/40 shadow-lg overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.25))",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">
              {item.title}
            </h2>
            <p className="text-muted-foreground">{item.text}</p>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
});

const ValuesSection = memo(function ValuesSection({
  t,
}: {
  t: ReturnType<typeof useTranslations>;
}) {
  const values = t.raw("valuesList") as string[];
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-10 text-center"
    >
      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
        {t("valuesTitle")}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.06,
              rotate: 1.5,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative group p-6 rounded-2xl bg-card/50 border border-border shadow-md backdrop-blur-md overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(147,51,234,0.25), transparent 70%)",
              }}
            />
            <p className="relative z-10 font-medium group-hover:text-primary transition-colors duration-300">
              {v}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});

const ExtraSection = memo(function ExtraSection({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text text-center">
        {title}
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            whileHover={{
              scale: 1.02,
              color: "rgb(99,102,241)",
            }}
            transition={{ duration: 0.4 }}
            className="transition-all"
          >
            {p}
          </motion.p>
        ))}
      </div>
    </motion.section>
  );
});

export default memo(ClientAbout);
