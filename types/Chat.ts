export type ChatRole = "user" | "assistant";

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ChatContainerProps {
  messages: ReadonlyArray<Message>;
  isTyping?: boolean;
  disableAutoScroll?: boolean;
  bottomThreshold?: number;
  className?: string;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: number;
}

export interface ChatMessageProps {
  role: ChatRole;
  content: string;
  showAvatar?: boolean;
  bubbleMaxWidth?: number;
  className?: string;
}

export interface TypingIndicatorProps {
  dotCount?: number;
  delayStep?: number;
  bubbleMaxWidth?: number;
  className?: string;
}
