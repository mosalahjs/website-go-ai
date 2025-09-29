"use client";
import React, { useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const GlassNavbarComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // useScroll returns motion values we can transform
  const { scrollYProgress } = useScroll();

  // progress width from 0% -> 100%
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // nav background/blur/height change on scroll
  const navBg = useTransform(
    scrollYProgress,
    [0, 0.12],
    ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.92)"]
  );
  const navBackdrop = useTransform(
    scrollYProgress,
    [0, 0.12],
    ["blur(4px)", "blur(12px)"]
  );
  const navHeight = useTransform(
    scrollYProgress,
    [0, 0.12],
    ["4rem", "3.4rem"]
  );

  const t = useTranslations("nav");

  // memoized nav links
  const navLinks = useMemo(
    () => [
      { name: t("home"), href: "#" },
      { name: t("products"), href: "#" },
      { name: t("services"), href: "#" },
      { name: t("about"), href: "#" },
      { name: t("contact"), href: "#" },
    ],
    [t]
  );

  return (
    <>
      {/* Progress bar */}
      <motion.div
        aria-hidden
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-gray-200 z-[60] origin-left"
      />

      <motion.nav
        style={{
          backgroundColor: navBg,
          backdropFilter: navBackdrop,
          height: navHeight,
        }}
        className="fixed top-[6px] left-0 right-0 z-50 border-b border-glass-border shadow-glass transition-[height] duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Image
                src={`/logo/main-logo.png`}
                alt="logo"
                width={250}
                height={250}
                priority
                className="object-cover size-36 md:size-56"
              />
            </motion.div>

            {/* Desktop nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    whileHover={{ scale: 1.04 }}
                    className="text-foreground hover:text-nav-primary px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Desktop actions */}
            <motion.div
              className="hidden md:flex items-center space-x-4 space-x-reverse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <LanguageSwitcher />
            </motion.div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((s) => !s)}
                className="text-foreground hover:text-nav-primary hover:bg-white/10"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-glass backdrop-blur-glass border-t border-glass-border">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="text-blue-400 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-white/10"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

const GlassNavbar = React.memo(GlassNavbarComponent);
export default GlassNavbar;
