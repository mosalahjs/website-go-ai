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
            className="w-16 h-16 rounded-full bg-main/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Sparkles className="size-8 text-main" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gradient-dash">
          {t("title")}
        </h2>
        <p className="text-main-muted-foreground text-lg">{t("subtitle")}</p>
      </div>
    </div>
  );
});
