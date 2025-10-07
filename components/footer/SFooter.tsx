"use client";

import React, { memo, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SiX, SiLinkedin, SiFacebook } from "react-icons/si";
import Logo from "../navbar/Logo";

const SOCIAL_LINKS = Object.freeze([
  {
    icon: SiLinkedin,
    href: "https://linkedin.com/",
    label: "LinkedIn",
    color: "#0077B5",
  },
  {
    icon: SiX,
    href: "https://twitter.com/",
    label: "Twitter / X",
    color: "#000000",
  },
  {
    icon: SiFacebook,
    href: "https://facebook.com/",
    label: "Facebook",
    color: "#1877F2",
  },
]);

const FOOTER_LINKS = Object.freeze([
  { title: "home", href: "/" },
  { title: "projects", href: "/projects" },
  { title: "about", href: "/about" },
  { title: "contact", href: "/contact" },
]);

const CURRENT_YEAR = new Date().getFullYear();

const SFooterComponent: React.FC = () => {
  const t = useTranslations("Footer");

  const navLinks = useMemo(
    () =>
      FOOTER_LINKS.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className="hover:text-foreground transition-colors"
        >
          {t(link.title)}
        </Link>
      )),
    [t]
  );

  const socialIcons = useMemo(
    () =>
      SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
        <motion.div
          key={label}
          whileHover={{
            scale: 1.15,
            rotate: 3,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Link
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-full border border-transparent hover:border-border",
              "transition-all duration-300 flex items-center justify-center"
            )}
          >
            <motion.div
              whileHover={{ color }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground"
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </Link>
        </motion.div>
      )),
    []
  );

  return (
    <footer
      className={cn(
        "relative w-full border-t border-border/40 backdrop-blur-sm",
        "bg-background/70"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* --- Top Section --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Logo />

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">{socialIcons}</div>
        </div>

        {/* --- Separator --- */}
        <Separator className="my-8 opacity-50" />

        {/* --- Bottom Section --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {CURRENT_YEAR} GO AI 247. {t("rights")}
          </p>
          <p className="text-xs">
            {t("builtBy")}{" "}
            <Link
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              GO AI 247
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export const SFooter = memo(SFooterComponent);
SFooter.displayName = "SFooter";

export default SFooter;
