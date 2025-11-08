"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEBSITE_NAME } from "@/constant";
import Logo from "../navbar/Logo";

export const Footer = memo(function Footer() {
  const t = useTranslations("mainFooter.footer");
  const year = new Date().getFullYear();

  const companyLinks = [
    { label: t("company.links.about"), href: "/about" },
    { label: t("company.links.projects"), href: "/projects" },
    { label: t("company.links.contact"), href: "/contact" },
  ];

  const services = [
    { label: t("services.items.frontend") },
    { label: t("services.items.ai") },
    { label: t("services.items.backend") },
    { label: t("services.items.consulting") },
  ];

  const resources = [
    { label: t("resources.items.blog") },
    { label: t("resources.items.cases") },
    { label: t("resources.items.docs") },
  ];

  const socials = [
    {
      label: t("socials.email"),
      href: "mailto:hello@goai247.com",
      icon: Mail,
      external: true,
    },
    { label: t("socials.linkedin"), href: "#", icon: Linkedin, external: true },
    { label: t("socials.twitter"), href: "#", icon: Twitter, external: true },
    { label: t("socials.github"), href: "#", icon: Github, external: true },
  ];

  return (
    <footer className="relative mt-16 border-t">
      <div className="pointer-events-none h-px w-full" />

      <div className={cn("relative container mx-auto px-4 sm:px-6 lg:px-8")}>
        <div className="relative">
          <div className="px-5 sm:px-8 lg:px-10 py-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
              <div className="md:col-span-2 space-y-4">
                <Logo />
                <p className="text-sm text-muted-foreground/90 max-w-prose">
                  {t("brand.intro")}
                </p>

                <div className="pt-3 flex items-center gap-3">
                  {socials.map(({ label, href, icon: Icon, external }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60",
                        "bg-background/70 hover:bg-background transition-colors",
                        "hover:shadow-[0_6px_24px_-8px_rgba(99,102,241,.35)]"
                      )}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold tracking-wide">
                  {t("company.title")}
                </h3>
                <ul className="space-y-2 text-sm">
                  {companyLinks.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold tracking-wide">
                  {t("services.title")}
                </h3>
                <ul className="space-y-2 text-sm">
                  {services.map((s) => (
                    <li
                      key={s.label}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold tracking-wide">
                  {t("resources.title")}
                </h3>
                <ul className="space-y-2 text-sm">
                  {resources.map((r) => (
                    <li
                      key={r.label}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                © {year} <span className="font-semibold">{WEBSITE_NAME}</span>.{" "}
                {t("rightsReserved")}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-indigo-500/15 px-2 py-1 border border-border/50">
                  {t("builtWith", { name: WEBSITE_NAME })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
