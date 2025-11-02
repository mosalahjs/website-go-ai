export interface Page {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  template: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  pageId: string;
  type: string;
  title: string;
  subtitle?: string;
  content: string;
  order: number;
  visible: boolean;
  settings: Record<string, any>;
}
