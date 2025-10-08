"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState, memo } from "react";

/* ---------- Main Component ---------- */
function ClientServices() {
  const t = useTranslations("Services");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background text-foreground">
      {/* Background animated glows */}
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

      {/* Content */}
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

        {/* Services Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {(t.raw("servicesList") as { title: string; text: string }[]).map(
            (srv, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.05,
                  rotateX: 3,
                  rotateY: -3,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group p-8 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-lg border border-border/40 shadow-lg overflow-hidden text-center"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(236,72,153,0.25))",
                  }}
                />
                <div className="relative z-10 space-y-4">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-pink-500 text-transparent bg-clip-text">
                    {srv.title}
                  </h2>
                  <p className="text-muted-foreground">{srv.text}</p>
                </div>
              </motion.div>
            )
          )}
        </motion.section>

        {/* How We Work Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            {t("processTitle")}
          </h2>
          <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t("processText")}
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {(t.raw("processSteps") as string[]).map((step, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-card/50 border border-border shadow-md backdrop-blur-md"
              >
                <p className="font-medium">{step}</p>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 py-12"
        >
          <h3 className="text-3xl font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
            {t("ctaTitle")}
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("ctaText")}
          </p>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="/contact"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            {t("ctaButton")}
          </motion.a>
        </motion.section>
      </div>
    </div>
  );
}

export default memo(ClientServices);
