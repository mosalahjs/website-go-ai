"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  const burgerRef = useRef<HTMLButtonElement>(null);

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
    ["4.4rem", "4rem"]
  );

  const t = useTranslations("nav");

  const navLinks = useMemo(
    () => [
      { name: t("home"), href: "/" },
      { name: t("projects"), href: "/projects" },
      { name: t("about"), href: "/about" },
      { name: t("services"), href: "/services" },
      { name: t("contact"), href: "/contact" },
    ],
    [t]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        style={{
          backgroundColor: navBg,
          backdropFilter: navBackdrop,
          height: navHeight,
        }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border shadow-glass transition-[height] duration-200 bg-navbar dark:!bg-zinc-800 "
      >
        <Container className="h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden lg:block">
              <NavLinks links={navLinks} />
            </div>

            {/* actions */}
            <Actions />

            {/* Mobile toggle */}
            <div className="lg:hidden">
              <BurgerButton
                ref={burgerRef}
                id="burger-button"
                isOpen={isOpen}
                size={34}
                toggle={() => setIsOpen((s) => !s)}
              />
            </div>
          </div>
        </Container>

        <div className="absolute -bottom-2 left-0 right-0 h-1.5 dark:!bg-zinc-800">
          <motion.div
            aria-hidden
            style={{ width: progressWidth }}
            className="h-full bg-gradient-to-r from-blue-500 to-gray-200 
                 dark:from-blue-400 dark:to-gray-700 origin-left"
          />
        </div>

        {/* Mobile menu */}
        <MobileMenu
          isOpen={isOpen}
          navLinks={navLinks}
          onClose={handleClose}
          burgerRef={burgerRef as React.RefObject<HTMLButtonElement>}
        />
      </motion.nav>
    </>
  );
};

export default React.memo(GlassNavbarClient);
