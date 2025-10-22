"use client";
import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputProps } from "@/types/Chat";
import { useChatInput } from "@/hooks/chat/useChatInput";
import axios from "axios";

export type ChatInputHandle = {
  focus: () => void;
  clear: () => void;
};

export const ChatInput = memo(
  forwardRef<ChatInputHandle, ChatInputProps>(function ChatInput(
    { onSend, disabled = false, placeholder, maxHeight = 100 }: ChatInputProps,
    ref
  ) {
    const t = useTranslations("ChatPage.CHAT.INPUT");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    const focusNow = useCallback(() => {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }, []);

    const { message, setMessage, isFocused, setIsFocused, handleKeyDown } =
      useChatInput((m) => {
        onSend(m);
        queueMicrotask(focusNow);
        formRef.current?.reset();
      }, disabled);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    useEffect(() => {
      if (!hasMounted) return;
      focusNow();
      const onWinFocus = () => focusNow();
      window.addEventListener("focus", onWinFocus);
      return () => window.removeEventListener("focus", onWinFocus);
    }, [hasMounted, focusNow]);

    useEffect(() => {
      if (!disabled && hasMounted) focusNow();
    }, [disabled, hasMounted, focusNow]);

    useImperativeHandle(
      ref,
      () => ({
        focus: focusNow,
        clear: () => setMessage(""),
      }),
      [focusNow, setMessage]
    );

    const autoGrow = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";

      const next = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > next ? "auto" : "hidden";
    }, [maxHeight]);

    useLayoutEffect(() => {
      autoGrow();
    }, [message, autoGrow]);

    const sendData = useCallback(async () => {
      try {
        const res = await axios.post(`http://localhost:8000/api/query_goai`, {
          query: "goai",
          session_id: "",
        });
        console.log(res);

        await res.data;
      } catch (err) {
        console.log("[sendData] error:", err);
      }
    }, []);

    const onKeyDownSafe = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposing) return;
        handleKeyDown(e);
      },

      [handleKeyDown, isComposing]
    );

    const resolvedPlaceholder = placeholder ?? t("placeholder");

    return (
      <form
        ref={formRef}
        onSubmit={sendData}
        className="w-full pb-4"
        aria-label="chat-input"
        aria-live="polite"
      >
        <div
          className={[
            "flex gap-3 items-center justify-between px-6 py-4 rounded-3xl bg-card border-2 transition-all duration-200",
            isFocused
              ? "border-gray-50 shadow-lg"
              : "border-transparent shadow-sm",
          ].join(" ")}
          data-focused={isFocused ? "true" : "false"}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              autoGrow();
            }}
            onKeyDown={onKeyDownSafe}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            dir="auto"
            rows={1}
            autoFocus={hasMounted}
            className="min-h-[24px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 !text-base"
            style={{ maxHeight }}
            aria-label={t("inputAria")}
            enterKeyHint="send"
            inputMode="text"
            autoCapitalize="sentences"
            spellCheck
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
  })
);
