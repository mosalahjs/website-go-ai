"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/public/assets/hero-coding.jpg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Container from "../shared/Container";

export function Hero() {
  const t = useTranslations("landingPage");
  const { theme } = useTheme();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-mesh z-10" />
        <Image
          src={heroImage}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-10" />
      </div>

      <Container>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden z-20">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                  background:
                    theme === "light"
                      ? "linear-gradient(90deg, #4F46E5, #3B82F6, #06B6D4)"
                      : theme === "dark"
                      ? "linear-gradient(135deg, #ffffff, #9ca3af, #374151)"
                      : "linear-gradient(90deg, #4F46E5, #3B82F6, #06B6D4)",
                }}
                className="inline-flex cursor-pointer items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-primary shadow-glow backdrop-blur-sm"
              >
                <Zap className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  AI-Powered Solutions
                </span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-9xl mx-auto font-bold bg-clip-text text-transparent
       text-gradient-third"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  Go AI 247
                </motion.h1>
                <motion.h3
                  className="text-lg md:text-xl font-semibold text-center mt-4 mb-6 bg-clip-text text-transparent
       text-gradient-third
        dark:from-[#8E969B] dark:to-[#525456]"
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
                <Button
                  asChild
                  size="lg"
                  className="
      text-white text-base px-8 py-6 rounded-2xl
      bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400
      hover:from-blue-500 hover:via-blue-400 hover:to-blue-300
      shadow-lg hover:shadow-xl transition-all duration-500 group
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
      dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-600
    "
                >
                  <Link href="/contact">
                    {t("getStarted")}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="
      text-base px-8 py-6 rounded-2xl 
      border-2 border-transparent
      text-blue-600 bg-white bg-clip-padding backdrop-blur-sm
      hover:text-white hover:bg-gradient-to-r 
      hover:from-blue-600 hover:to-blue-400
      transition-all duration-500
      
      dark:text-gray-200 dark:bg-black/30 
      dark:hover:bg-gradient-to-r dark:hover:from-gray-200 dark:hover:to-gray-400 
      dark:hover:text-black
    "
                >
                  <Link href="/projects">{t("viewProjects")}</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center justify-center space-x-8 pt-4"
              >
                <div>
                  <div className="text-3xl font-bold text-main">50+</div>
                  <div className="text-sm text-main-muted-foreground">
                    {t("Projects Delivered")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-main">98%</div>
                  <div className="text-sm text-main-muted-foreground">
                    {t("Client Satisfaction")}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-main">24/7</div>
                  <div className="text-sm text-main-muted-foreground">
                    {t("Support")}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative lg:block hidden"
            >
              <motion.div
                animate={{
                  y: [0, -30, 0],
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative rounded-3xl overflow-hidden shadow-intense border-4 border-primary/20"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-20 mix-blend-overlay z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 z-10" />
                <Image
                  src={heroImage}
                  alt="AI Technology Workspace"
                  className="w-full h-auto rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              </motion.div>

              {/* Enhanced Floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 8, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 bg-card/90 border-2 border-primary/30 backdrop-blur-xl rounded-3xl p-6 shadow-intense"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold">AI Integration</div>
                    <div className="text-sm text-muted-foreground">
                      Neural Networks
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -8, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-8 -left-8 bg-card/90 border-2 border-secondary/30 backdrop-blur-xl rounded-3xl p-6 shadow-intense"
              >
                <div className="space-y-2">
                  <div className="text-base font-bold">99.9% Uptime</div>
                  <div className="text-sm text-muted-foreground">
                    Enterprise Ready
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-500">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Additional decorative element */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-primary opacity-20 rounded-full blur-2xl -z-10"
              />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
