"use client";
import { useState, useCallback } from "react";

export function useChatInput(
  onSend: (msg: string) => void,
  disabled?: boolean
) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const text = message.trim();
      if (!text || disabled) return;
      onSend(text);
      setMessage("");
    },
    [message, onSend, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return {
    message,
    setMessage,
    isFocused,
    setIsFocused,
    handleSubmit,
    handleKeyDown,
  };
}
