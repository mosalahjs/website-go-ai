"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type EmptyStateProps = {
  className?: string;
};

export const EmptyState = memo(function EmptyState({
  className,
}: EmptyStateProps) {
  const t = useTranslations("ChatPage.CHAT.EMPTY_STATE");

  return (
    <div className={cn("flex items-center justify-center h-full", className)}>
      <div className="text-center space-y-4 animate-fade-in-scale">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            aria-label={t("sparklesAria")}
          >
            <Sparkles className="w-8 h-8 text-primary" aria-hidden />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-foreground">{t("title")}</h2>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>
    </div>
  );
});
