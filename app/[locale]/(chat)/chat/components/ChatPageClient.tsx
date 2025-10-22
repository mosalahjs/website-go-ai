// components/chat/ChatPageClient.tsx
"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
// import { useTranslations } from "next-intl";
import { ChatContainer } from "./ChatContainer";
import { ChatInput, type ChatInputHandle } from "./ChatInput";
import { ChatMessage, useStreamMessage } from "@/hooks/chat/useStreamMessage";

export default function ChatPageClient() {
  // const t = useTranslations("ChatPage.CHAT.PAGE");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<ChatInputHandle | null>(null);

  const { mutate: stream } = useStreamMessage({
    setMessages,
    setIsTyping,
    endpoint: "/api/query_goai",
    nResults: 2,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSend = useCallback(
    async (content: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          content,
          timestamp: new Date(),
        },
      ]);

      try {
        await stream(content);
      } catch (err) {
        console.error("Failed to send message:", err);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [stream]
  );

  type ChatContainerProps = React.ComponentProps<typeof ChatContainer>;
  const uiMessages = messages as unknown as ChatContainerProps["messages"];

  return (
    <div className="flex flex-col h-[calc(100vh-3.25rem)] bg-background">
      <ChatContainer messages={uiMessages} isTyping={isTyping} />
      <div className="border-t border-border bg-background/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput ref={inputRef} onSend={onSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
