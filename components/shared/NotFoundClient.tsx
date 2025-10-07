"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import heroImage from "@/public/assets/hero-coding.jpg";
// next-intl
import { useTranslations } from "next-intl";

export default function NotFoundClient() {
  const t = useTranslations("NotFound");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ top: number; left: number }[]>(
    []
  );

  useEffect(() => {
    setMounted(true);
    const arr = Array.from({ length: 10 }, () => ({
      top: Math.random() * 90,
      left: Math.random() * 90,
    }));
    setParticles(arr);
  }, []);

  const gradient = useMemo(() => {
    if (!mounted) return "from-blue-600 via-cyan-400 to-indigo-500";
    return theme === "dark"
      ? "from-gray-900 via-gray-800 to-slate-700"
      : "from-blue-500 via-cyan-400 to-indigo-400";
  }, [theme, mounted]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-6">
      {/* Background Layer */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt={t("backgroundAlt")}
          fill
          priority
          className="object-cover opacity-25 dark:opacity-15 select-none pointer-events-none"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-40 blur-3xl`}
        />
        <div className="absolute inset-0 backdrop-blur-[3px]" />
      </div>

      {/* Animated Warning Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md bg-gradient-to-r ${gradient} text-white`}
      >
        <motion.div
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <AlertTriangle className="w-5 h-5 text-yellow-300" />
        </motion.div>
        <span className="text-sm font-semibold">{t("pageNotFound")}</span>
      </motion.div>

      {/* 404 Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mt-10 text-8xl sm:text-9xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-400"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl text-center"
      >
        {t("message")}
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10"
      >
        <Button
          asChild
          size="lg"
          className="relative overflow-hidden group rounded-2xl px-8 py-5 font-semibold text-white shadow-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500"
        >
          <Link href="/" className="flex items-center gap-2">
            <span>{t("backToHome")}</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Home className="h-5 w-5" />
            </motion.div>

            {/* Glow Effect */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 blur-xl group-hover:opacity-30 transition duration-500" />
          </Link>
        </Button>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute block w-2 h-2 rounded-full bg-cyan-400/40"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        className="mt-16 text-muted-foreground/70 text-xs tracking-widest"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        — Go AI 247 © {new Date().getFullYear()}
      </motion.div>
    </section>
  );
}
