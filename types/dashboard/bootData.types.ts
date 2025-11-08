export interface CompanyTopic {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyText {
  id: string;
  topicId: string;
  text: string;
  order: number;
  createdAt: string;
}

export type DeleteDialogState = { type: "topic" | "text"; id: string } | null;

export type TopicForm = { name: string };
export type TextForm = { text: string };
