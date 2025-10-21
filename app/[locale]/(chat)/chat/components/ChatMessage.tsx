"use client";

import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatMessageProps } from "@/types/Chat";

export const ChatMessage = memo(function ChatMessage({
  role,
  content,
  showAvatar = true,
  bubbleMaxWidth = 0.75,
  className,
}: ChatMessageProps) {
  const t = useTranslations("ChatPage.CHAT.MESSAGE");

  const isUser = role === "user";
  const label = isUser ? t("userLabel") : t("assistantLabel");

  const wrapperClasses = useMemo(
    () =>
      cn(
        "flex w-full gap-3 animate-slide-up group",
        isUser ? "justify-end" : "justify-start",
        className
      ),
    [isUser, className]
  );

  const bubbleClasses = useMemo(
    () =>
      cn(
        "rounded-2xl px-4 py-3 transition-all duration-200",
        isUser
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-gray-50 dark:bg-black/20 dark:text-white hover:bg-muted"
      ),
    [isUser]
  );

  const avatar = useMemo(() => {
    if (!showAvatar) return null;

    return isUser ? (
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-chat-dark-gray flex items-center justify-center"
        aria-hidden
      >
        <User className="w-5 h-5 text-white" />
      </div>
    ) : (
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center"
        aria-hidden
      >
        <Bot className="w-5 h-5 text-primary-foreground" />
      </div>
    );
  }, [isUser, showAvatar]);

  const safeMax = Math.max(0.3, Math.min(bubbleMaxWidth, 1));

  return (
    <div
      className={wrapperClasses}
      data-role={role}
      role="article"
      aria-label={label}
    >
      {!isUser && avatar}

      <div className={bubbleClasses} style={{ maxWidth: `${safeMax * 100}%` }}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
          {content}
        </p>
      </div>

      {isUser && avatar}
    </div>
  );
});
