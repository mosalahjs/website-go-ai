"use client";
import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Message } from "@/types/Chat";
import { ChatContainer } from "./ChatContainer";
import { ChatInput } from "./ChatInput";

export default function ChatPageClient() {
  const t = useTranslations("ChatPage.CHAT.PAGE");
  const [messages, setMessages] = useState<ReadonlyArray<Message>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const timer = setTimeout(() => {
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: t("botWelcome"),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    },
    [t]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.25rem)] bg-background">
      {/* Chat Container */}
      <ChatContainer messages={messages} isTyping={isLoading} />

      {/* Input Area */}
      <div className="border-t border-border bg-background/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
