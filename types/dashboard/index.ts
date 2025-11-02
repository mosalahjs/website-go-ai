export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type Session = {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at?: string;
};

export type Topic = {
  id: string;
  name: string;
  created_at?: string;
};

export type Chunk = {
  id: string;
  topic_id: string;
  content: string;
  created_at?: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
