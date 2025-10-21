"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowUpLeft } from "lucide-react";

export function GoToSiteButton() {
  const t = useTranslations("ChatPage.CHAT.ACTIONS");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const Icon = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="gap-2 text-sm hover:bg-muted transition-colors"
    >
      <Link
        href="/"
        className="flex items-center"
        aria-label={t("openExternal")}
      >
        <span className="hidden sm:inline">{t("goToSite")}</span>
        <Icon className="w-4 h-4" />
      </Link>
    </Button>
  );
}
