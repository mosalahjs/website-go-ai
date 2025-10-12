"use client";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
// components
import Logo from "./Logo";
import Actions from "./Actions";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import BurgerButton from "./BurgerButton";
import Container from "../shared/Container";

type NavLink = { name: string; href: string };

const GlassNavbarClient: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  // ===== Scroll-driven UI =====
  const { scrollYProgress } = useScroll();

  const progressWidth = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "100%"]
  );

  const colorStops = useMemo<[string, string]>(() => {
    if (!mounted) {
      return ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.92)"];
    }
    return theme === "dark"
      ? ["rgba(17,17,17,0.3)", "rgba(17,17,17,0.9)"]
      : ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.92)"];
  }, [mounted, theme]);

  const navBg = useTransform(scrollYProgress, [0, 0.12], colorStops);
  const navBackdrop = useTransform(
    scrollYProgress,
    [0, 0.12],
    prefersReducedMotion
      ? ["blur(0px)", "blur(0px)"]
      : ["blur(4px)", "blur(12px)"]
  );
  const navHeight = useTransform(
    scrollYProgress,
    [0, 0.12],
    prefersReducedMotion ? ["4.4rem", "4.4rem"] : ["4.4rem", "4rem"]
  );

  // ===== i18n & routing =====
  const t = useTranslations("nav");

  const rawPathname = usePathname() || "/";
  const pathname = useMemo(() => {
    const noLocale = removeLocalePrefix(rawPathname);
    const clean = noLocale.split("?")[0].split("#")[0];
    return clean !== "/" && clean.endsWith("/") ? clean.slice(0, -1) : clean;
  }, [rawPathname]);

  // ===== Base links =====
  const baseLinks: NavLink[] = useMemo(
    () => [
      { name: t("home"), href: "/" },
      { name: t("projects"), href: "/projects" },
      { name: t("about"), href: "/about" },
      { name: t("services"), href: "/services" },
      { name: t("contact"), href: "/contact" },
    ],
    [t]
  );

  const navLinks: NavLink[] = useMemo(() => {
    return baseLinks.map((l) => {
      if (l.href !== "/") {
        const isExact = pathname === l.href;
        const isNested = pathname.startsWith(l.href + "/");
        if (isExact || isNested) return { ...l, href: pathname };
      } else {
        if (pathname === "/") return { ...l, href: pathname };
      }
      return l;
    });
  }, [baseLinks, pathname]);

  // ===== Lifecycle =====
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== Handlers =====
  const handleClose = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((s) => !s), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        style={{
          backgroundColor: navBg,
          backdropFilter: navBackdrop,
          height: navHeight,
        }}
        className="border-b border-glass-border shadow-glass transition-[height] duration-200 bg-navbar dark:!bg-zinc-800"
        aria-label="Main"
      >
        <Container className="h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden lg:block">
              <NavLinks links={navLinks} />
            </div>

            {/* Actions */}
            <Actions />

            {/* Mobile toggle */}
            <div className="lg:hidden">
              <BurgerButton
                ref={burgerRef}
                id="burger-button"
                isOpen={isOpen}
                size={34}
                toggle={toggleMenu}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              />
            </div>
          </div>
        </Container>

        {/* Scroll progress bar */}
        <div
          className="absolute -bottom-2 left-0 right-0 h-1.5 dark:!bg-zinc-800"
          aria-hidden
        >
          <motion.div
            style={{ width: progressWidth }}
            className="h-full bg-gradient-to-r from-blue-500 to-gray-200 dark:from-blue-400 dark:to-gray-700 origin-left"
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
    </header>
  );
};

export default React.memo(GlassNavbarClient);

// ===== Helpers =====

function removeLocalePrefix(p: string) {
  const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/.*|$)/);
  return m ? m[2] || "/" : p;
}
