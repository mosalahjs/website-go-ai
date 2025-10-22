"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Message } from "@/types/Chat";
import { ChatContainer } from "./ChatContainer";
import { ChatInput, type ChatInputHandle } from "./ChatInput";

export default function ChatPageClient() {
  const t = useTranslations("ChatPage.CHAT.PAGE");
  const [messages, setMessages] = useState<ReadonlyArray<Message>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<ChatInputHandle | null>(null);

  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    window.addEventListener("focus", focusInput);
    return () => window.removeEventListener("focus", focusInput);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMessage]);

      inputRef.current?.focus();

      setIsLoading(true);
      const timer = setTimeout(() => {
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: t("botWelcome"),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);

        inputRef.current?.focus();
      }, 900);

      return () => clearTimeout(timer);
    },
    [t]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.25rem)] bg-background">
      <ChatContainer messages={messages} isTyping={isLoading} />
      <div className="border-t border-border bg-background/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            ref={inputRef}
            onSend={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
