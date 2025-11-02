// types/dashboard/sessions.type.ts

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string; // ISO
  timestamp?: string; // ISO
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  created_at: string; // ISO
  last_updated?: string; // ISO
  liked?: boolean;
  /** قديمة عندك كاختيارى – هنضمنها دايمًا في الـUI via utils */
  session_id?: string;
}

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

/** واجهة UI تسمح بخصائص اضافية مثل liked بدون كسر النوع */
export type UISession = Session & {
  liked?: boolean;
};
