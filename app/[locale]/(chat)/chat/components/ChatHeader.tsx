"use client";
import Actions from "@/components/navbar/Actions";
import { Bot, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

type ChatHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  const t = useTranslations("ChatPage.CHAT.HEADER");

  const resolvedTitle = title ?? t("title");
  const resolvedSubtitle = subtitle ?? t("online");

  return (
    <header className="border-b border-border bg-card px-4 md:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 backdrop-blur-sm">
      <Actions />
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label={t("menuAria")}
          type="button"
        >
          <Menu className="w-5 h-5 text-foreground" aria-hidden="true" />
        </button>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full bg-primary"
          aria-hidden="true"
        >
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            {resolvedTitle}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              aria-label={t("statusDotAria")}
            />
            {resolvedSubtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
