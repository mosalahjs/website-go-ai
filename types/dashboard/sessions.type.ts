export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  timestamp?: string;
}

/**
 * Session structure
 */
export interface Session {
  id: string;
  session_id: string;
  title: string;
  messages: Message[];
  created_at: string;
  last_updated?: string;
  liked?: boolean;
}

export type UISession = Session;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SessionsResponse extends ApiResponse<Session[]> {
  data?: Session[];
}

export interface SessionResponse extends ApiResponse<Session> {
  data?: Session;
}

export interface MessageResponse extends ApiResponse<Message> {
  data?: Message;
}

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ApiSession {
  session_id: string;
  messages: ApiMessage[];
  last_message_at: string;
  message_count: number;
}

export interface ApiHistoryResponse {
  success: boolean;
  data?: {
    sessions: ApiSession[];
    total_sessions: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
