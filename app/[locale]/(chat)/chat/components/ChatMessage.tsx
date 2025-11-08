"use client";
import React, { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatMessageProps } from "@/types/Chat";
import MarkdownMessage from "./MarkdownMessage";

/** ===== ⭐ COMPREHENSIVE Farsi→Arabic Normalizer ===== */
function normalizeFarsiToArabic(input: string): string {
  if (!input) return "";

  return (
    input
      // ========== YEH VARIANTS ==========
      .replace(/\u06CC/g, "\u064A") // ی Farsi Yeh → ي Arabic Yeh
      .replace(/\u06D2/g, "\u064A") // ے Urdu Yeh Barree → ي
      .replace(/\u0649/g, "\u064A") // ى Alef Maksura → ي

      // ========== KAF VARIANTS ==========
      .replace(/\u06A9/g, "\u0643") // ک Farsi Kaf → ك Arabic Kaf

      // ========== HEH VARIANTS ==========
      .replace(/\u06BE/g, "\u0647") // ہ Heh Doachashmee → ه Arabic Heh
      .replace(/\u06D5/g, "\u0629") // ە Kurdish Ae → ة Taa Marbouta
      .replace(/\u06C0/g, "\u0629") // ۀ Heh with Yeh above → ة

      // ========== PERSIAN-SPECIFIC LETTERS ==========
      .replace(/\u067E/g, "\u0628") // پ Peh → ب Beh
      .replace(/\u0686/g, "\u062C") // چ Tcheh → ج Jeem
      .replace(/\u0698/g, "\u0632") // ژ Jeh → ز Zain
      .replace(/\u06AF/g, "\u0643") // گ Gaf → ك Kaf

      // ========== NUMBERS ==========
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x0660)
      )

      // ========== ZERO-WIDTH CLEANUP ==========
      .replace(/\u200C/g, "") // Zero Width Non-Joiner
      .replace(/\u200D/g, "") // Zero Width Joiner
  );
}

/** ===== Arabic/RTL detection ===== */
const hasArabic = (s: string) =>
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
    s || ""
  );

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

  // ✅ Normalize Farsi → Arabic first, then detect direction
  const fixedContent = useMemo(
    () => normalizeFarsiToArabic(content || ""),
    [content]
  );
  const isRTL = hasArabic(fixedContent);

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
        "rounded-2xl px-4 py-1 transition-all duration-200",
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
        className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-4"
        aria-hidden
      >
        <Bot className="size-5 text-primary-foreground" />
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
      <div
        className={cn(
          bubbleClasses,
          "mb-6 whitespace-pre-wrap",
          "[unicode-bidi:isolate]",
          "tracking-normal"
        )}
        style={{ maxWidth: `${safeMax * 100}%` }}
        dir={isRTL ? "rtl" : "ltr"}
        lang={isRTL ? "ar" : "en"}
      >
        <div
          className={cn(isRTL && "text-right")}
          style={
            isRTL
              ? {
                  wordBreak: "normal",
                  overflowWrap: "break-word",
                  letterSpacing: "normal",
                  wordSpacing: "normal",
                  textTransform: "none",
                  fontVariantLigatures: "common-ligatures contextual",
                  fontKerning: "normal",
                  textRendering: "optimizeLegibility",
                  fontFamily:
                    '"IBM Plex Sans Arabic","Cairo","Noto Naskh Arabic","Segoe UI",system-ui,sans-serif',
                }
              : undefined
          }
        >
          <MarkdownMessage
            text={fixedContent}
            className="text-sm leading-relaxed"
          />
        </div>
      </div>
      {isUser && avatar}
    </div>
  );
});
