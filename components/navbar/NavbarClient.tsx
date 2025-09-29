"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
// components
import Logo from "./Logo";
import Actions from "./Actions";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import BurgerButton from "./BurgerButton";
import Container from "../shared/Container";

const GlassNavbarClient: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const navBg = useTransform(
    scrollYProgress,
    [0, 0.12],
    mounted && theme === "dark"
      ? ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)"]
      : ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.92)"]
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

  const navLinks = useMemo(
    () => [
      { name: t("home"), href: "/" },
      { name: t("products"), href: "/products" },
      { name: t("services"), href: "/services" },
      { name: t("about"), href: "/about" },
      { name: t("contact"), href: "/contact" },
    ],
    [t]
  );

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 right-0 h-1.5 w-full dark:!bg-zinc-800 z-[60] origin-left">
        <motion.div
          aria-hidden
          style={{ width: progressWidth }}
          className="h-full bg-gradient-to-r from-blue-500 to-gray-200 
               dark:from-blue-400 dark:to-gray-700 origin-left"
        />
      </div>

      <motion.nav
        style={{
          backgroundColor: navBg,
          backdropFilter: navBackdrop,
          height: navHeight,
        }}
        className="fixed top-[6px] left-0 right-0 z-50 border-b border-glass-border shadow-glass transition-[height] duration-200 bg-navbar dark:!bg-zinc-800 "
      >
        <Container className="h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden md:block">
              <NavLinks links={navLinks} />
            </div>

            {/* actions */}
            <Actions />

            {/* Mobile toggle */}
            <div className="md:hidden">
              <BurgerButton
                isOpen={isOpen}
                size={34}
                toggle={() => setIsOpen((s) => !s)}
              />
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        <MobileMenu isOpen={isOpen} navLinks={navLinks} />
      </motion.nav>
    </>
  );
};

export default React.memo(GlassNavbarClient);
