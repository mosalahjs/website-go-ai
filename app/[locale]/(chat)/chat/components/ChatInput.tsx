"use client";
import React, { memo } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputProps } from "@/types/Chat";
import { useChatInput } from "@/hooks/chat/useChatInput";

export const ChatInput = memo(function ChatInput({
  onSend,
  disabled = false,
  placeholder,
  maxHeight = 100,
}: ChatInputProps) {
  const t = useTranslations("ChatPage.CHAT.INPUT");

  const {
    message,
    setMessage,
    isFocused,
    setIsFocused,
    handleSubmit,
    handleKeyDown,
  } = useChatInput(onSend, disabled);

  const resolvedPlaceholder = placeholder ?? t("placeholder");

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full pb-2"
      aria-label="chat-input"
    >
      <div
        className={[
          "flex gap-3 items-center justify-between px-6 py-4 rounded-3xl bg-card border-2 transition-all duration-200",
          isFocused
            ? "border-primary shadow-lg"
            : "border-transparent shadow-sm",
        ].join(" ")}
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          dir="auto"
          rows={1}
          className="min-h-[24px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 !text-base"
          style={{ maxHeight }}
          aria-label={t("inputAria")}
        />

        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
          className="size-9 rounded-full bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-200 flex-shrink-0 disabled:opacity-30"
          aria-label={t("sendAria")}
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
});
