"use client";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type OnlineBadgeProps = {
  className?: string;
  label?: string;
};

export const OnlineBadge = memo(function OnlineBadge({
  className,
  label,
}: OnlineBadgeProps) {
  const t = useTranslations("ChatPage.CHAT.HEADER");
  const text = label ?? t("online");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 relative",
        "before:content-[''] before:block before:w-2 before:h-2 before:rounded-full before:bg-green-500 before:animate-pulse",
        className
      )}
    >
      <span>{text}</span>
    </span>
  );
});
