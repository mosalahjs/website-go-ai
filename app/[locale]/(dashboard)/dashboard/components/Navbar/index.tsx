"use client";

import * as React from "react";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamic import to reduce initial JS
const ThemeToggle = dynamic(() => import("@/components/navbar/ThemeToggle"), {
  ssr: false,
});
const LanguageSwitcher = dynamic(
  () => import("@/components/navbar/LanguageSwitcher"),
  {
    ssr: false,
  }
);

type NavItem = { labelKey: string; href: string; external?: boolean };

const NAV_ITEMS: NavItem[] = [
  { labelKey: "links.home", href: "/" },
  { labelKey: "links.about", href: "/about" },
  { labelKey: "links.services", href: "/services" },
  { labelKey: "links.blog", href: "/blog" },
  { labelKey: "links.contact", href: "/contact" },
];

export default function Navbar() {
  const t = useTranslations("dashboard.navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // A11y: close on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = React.useCallback(
    (href: string) => {
      if (href === "/")
        return pathname === `/${locale}` || pathname === `/${locale}/`;
      return pathname?.startsWith(`/${locale}${href}`);
    },
    [pathname, locale]
  );

  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
    [t]
  );

  return (
    <>
      {/* Skip to main content for screen readers/keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground rounded-md px-3 py-2"
      >
        {t("a11y.skip_to_content")}
      </a>

      <header
        role="banner"
        aria-label={t("a11y.site_header")}
        className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label={t("brand_aria")}
              className="flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <span
                className="inline-block h-8 w-8 rounded gradient-dash-primary"
                aria-hidden="true"
              />
              <span className="font-semibold tracking-tight">{t("brand")}</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label={t("a11y.primary_nav")}
          >
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive(item.href)
                      ? "bg-muted font-medium"
                      : "hover:bg-muted"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )
            )}

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* External icons with security attrs */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaGithub aria-hidden />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FaLinkedin aria-hidden />
            </a>

            <Separator orientation="vertical" className="mx-1 h-6" />
            <LanguageSwitcher />
            {/* <LanguageSwitcher label={t("actions.language")} Icon={Languages} /> */}
            <ThemeToggle
            //   labelLight={t("actions.light")}
            //   labelDark={t("actions.dark")}
            //   IconSun={Sun}
            //   IconMoon={Moon}
            />
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={open ? t("menu.close") : t("menu.open")}
                >
                  {open ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80"
                aria-label={t("a11y.mobile_nav")}
              >
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold">{t("brand")}</span>
                  <div className="flex items-center gap-1">
                    {/* <LanguageSwitcher compact /> */}
                    {/* <ThemeToggle compact /> */}
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
                <Separator className="my-3" />
                <ul className="space-y-1" role="list">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted"
                          )}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive(item.href)
                              ? "bg-muted font-medium"
                              : "hover:bg-muted"
                          )}
                          aria-current={
                            isActive(item.href) ? "page" : undefined
                          }
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <Separator className="my-3" />
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FaGithub aria-hidden />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <FaLinkedin aria-hidden />
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
