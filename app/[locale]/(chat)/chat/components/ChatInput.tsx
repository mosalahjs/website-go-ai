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
import { Send, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputProps } from "@/types/Chat";
import { useChatInput } from "@/hooks/chat/useChatInput";

export type ChatInputHandle = {
  focus: () => void;
  clear: () => void;
};

type ExtraProps = {
  isStreaming?: boolean;
  onStop?: () => void;
};

export const ChatInput = memo(
  forwardRef<ChatInputHandle, ChatInputProps & ExtraProps>(function ChatInput(
    {
      onSend,
      disabled = false,
      placeholder,
      maxHeight = 100,
      isStreaming = false,
      onStop,
    }: ChatInputProps & ExtraProps,
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

    useEffect(() => setHasMounted(true), []);
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

    const onKeyDownSafe = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposing) return;
        handleKeyDown(e);
      },
      [handleKeyDown, isComposing]
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const m = message.trim();
        if (!m || disabled || isStreaming) return;
        onSend(m);
        formRef.current?.reset();
        setMessage("");
        queueMicrotask(focusNow);
      },
      [message, disabled, isStreaming, onSend, setMessage, focusNow]
    );

    const resolvedPlaceholder = placeholder ?? t("placeholder");
    const canSend = !!message.trim() && !disabled && !isStreaming;
    const showStop = isStreaming;

    return (
      <form
        ref={formRef}
        className="w-full pb-4"
        aria-label="chat-input"
        aria-live="polite"
        onSubmit={handleSubmit}
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

          {showStop ? (
            <Button
              type="button"
              onClick={onStop}
              disabled={false}
              size="icon"
              className="size-9 rounded-full bg-main hover:bg-main/90 hover:scale-110 transition-all duration-200 flex-shrink-0"
              aria-label={t("stopAria")}
            >
              <Square className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canSend}
              size="icon"
              className="size-9 rounded-full bg-main hover:bg-mian/90 hover:scale-110 transition-all duration-200 flex-shrink-0 disabled:opacity-30"
              aria-label={t("sendAria")}
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </form>
    );
  })
);
