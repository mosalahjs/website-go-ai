"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type NavItem = {
  titleKey: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { titleKey: "links.dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    titleKey: "links.sessions",
    url: "/dashboard/sessions",
    icon: MessageSquare,
  },
  { titleKey: "links.content", url: "/dashboard/content", icon: FileText },
  { titleKey: "links.settings", url: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(
    () => NAV_ITEMS.map((it) => ({ ...it, title: t(it.titleKey) })),
    [t]
  );

  // ✅ Longest-prefix match لضمان عنصر Active واحد فقط
  const activeHref = useMemo(() => {
    const base = `/${locale}`;
    const fullPath = pathname || "";
    // اعثر على كل العناصر التي يطابق مسارها بداية الـpathname (أو مساواة كاملة)
    const candidates = items
      .map((it) => {
        const full = `${base}${it.url}`;
        const match = fullPath === full || fullPath.startsWith(`${full}/`);
        return { href: it.url, full, match, len: full.length };
      })
      .filter((c) => c.match);
    if (candidates.length === 0) return null;
    // خُذ أطول مسار مطابق (الأكثر تحديدًا)
    candidates.sort((a, b) => b.len - a.len);
    return candidates[0].href;
  }, [items, locale, pathname]);

  const isActive = React.useCallback(
    (href: string) => href === activeHref,
    [activeHref]
  );

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        role="complementary"
        aria-label={t("a11y.sidebar")}
        className={cn(
          "h-full min-h-0 bg-card-dash border-r border-border-dash/50 transition-all duration-300 flex flex-col shadow-sm",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo / Brand */}
        <div className="h-16 border-b border-border-dash/50 flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center gradient-dash-primary text-white font-bold text-lg shadow-lg relative overflow-hidden group bg-primary/90"
                aria-hidden="true"
              >
                <Sparkles className="h-5 w-5 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:opacity-0 transition-opacity">
                  G
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">
                  {t("brand.short")}
                </span>
                <span className="text-xs text-muted-foreground-dash font-medium">
                  {t("brand.subtitle")}
                </span>
              </div>
            </div>
          )}

          <Button
            size="icon"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "h-8 w-8 rounded-lg gradient-dash-primary hover:opacity-60 cursor-pointer",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? t("actions.expand") : t("actions.collapse")}
            aria-pressed={collapsed}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 p-3 space-y-1"
          aria-label={t("a11y.primary_nav")}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url);

            const linkEl = (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-[background,transform,color] duration-200 group",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-dash",
                  active
                    ? "bg-primary-dash shadow-sm scale-[1.01] gradient-dash-primary text-[hsl(var(--dash-primary-foreground))]"
                    : "text-muted-foreground-dash hover:bg-secondary-dash/60 hover:text-foreground-dash"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg ring-1 ring-inset ring-primary-dash/30"
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    active
                      ? "scale-110 text-[hsl(var(--dash-primary-foreground))]"
                      : "group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap",
                      active &&
                        "font-semibold text-[hsl(var(--dash-primary-foreground))]"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.url}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ) : (
              linkEl
            );
          })}
        </nav>

        {/* Footer / Status */}
        <div className="p-3 border-t border-border-dash/50">
          {!collapsed ? (
            <div
              className="px-3 py-2 rounded-lg bg-secondary-dash/40 border border-border-dash/60"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full bg-primary-dash animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-primary-dash">
                  {t("status.online")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground-dash">
                {t("status.version", { v: "1.0.0" })}
              </p>
            </div>
          ) : (
            <span
              className="w-2 h-2 rounded-full bg-primary-dash animate-pulse block mx-auto"
              aria-label={t("status.online")}
            />
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

export default Sidebar;
