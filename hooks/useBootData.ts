"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner"; // ← استخدام sonner بدلاً من "@/hooks/use-toast"
import type {
  CompanyText,
  CompanyTopic,
  DeleteDialogState,
  TopicForm,
  TextForm,
} from "@/types/dashboard/bootData.types";

const success = (title: string, description?: string) =>
  toast.success(title, description ? { description } : undefined);

const error = (title: string, description?: string) =>
  toast.error(title, description ? { description } : undefined);

export function useBootData() {
  // Core state
  const [topics, setTopics] = useState<CompanyTopic[]>([]);
  const [texts, setTexts] = useState<CompanyText[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<CompanyTopic | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialogs
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);

  // Forms + editing
  const [editingTopic, setEditingTopic] = useState<CompanyTopic | null>(null);
  const [editingText, setEditingText] = useState<CompanyText | null>(null);
  const [topicForm, setTopicForm] = useState<TopicForm>({ name: "" });
  const [textForm, setTextForm] = useState<TextForm>({ text: "" });

  // Load mock data (same as original)
  useEffect(() => {
    setLoading(true);
    const now = Date.now();

    const mockTopics: CompanyTopic[] = [
      {
        id: "1",
        name: "Company Overview",
        createdAt: new Date(now - 7 * 864e5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Customer Support",
        createdAt: new Date(now - 5 * 864e5).toISOString(),
        updatedAt: new Date(now - 1 * 864e5).toISOString(),
      },
      {
        id: "3",
        name: "Pricing",
        createdAt: new Date(now - 3 * 864e5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Security",
        createdAt: new Date(now - 2 * 864e5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const mockTexts: CompanyText[] = [
      {
        id: "t1",
        topicId: "1",
        text: "Our company specializes in cutting-edge AI solutions for enterprise clients, providing scalable and intelligent automation tools that transform business operations.",
        order: 1,
        createdAt: new Date(now - 7 * 864e5).toISOString(),
      },
      {
        id: "t2",
        topicId: "1",
        text: "With over a decade of experience in artificial intelligence and machine learning, we've helped thousands of companies streamline their workflows and increase productivity.",
        order: 2,
        createdAt: new Date(now - 7 * 864e5).toISOString(),
      },
      {
        id: "t3",
        topicId: "1",
        text: "Our team consists of world-class AI researchers, engineers, and business strategists who are passionate about building innovative solutions.",
        order: 3,
        createdAt: new Date(now - 7 * 864e5).toISOString(),
      },

      {
        id: "t4",
        topicId: "2",
        text: "We offer 24/7 customer support with an average response time of under 2 hours, ensuring client satisfaction and immediate assistance when you need it most.",
        order: 1,
        createdAt: new Date(now - 5 * 864e5).toISOString(),
      },
      {
        id: "t5",
        topicId: "2",
        text: "Our dedicated support team is trained to handle technical issues, billing inquiries, and product questions with expertise and professionalism.",
        order: 2,
        createdAt: new Date(now - 5 * 864e5).toISOString(),
      },
      {
        id: "t6",
        topicId: "2",
        text: "We provide comprehensive documentation, video tutorials, and live chat support to help you get the most out of our platform.",
        order: 3,
        createdAt: new Date(now - 5 * 864e5).toISOString(),
      },

      {
        id: "t7",
        topicId: "3",
        text: "Our pricing model is flexible and tailored to business needs, with transparent monthly subscriptions starting at $99/month and no hidden fees.",
        order: 1,
        createdAt: new Date(now - 3 * 864e5).toISOString(),
      },
      {
        id: "t8",
        topicId: "3",
        text: "Enterprise clients benefit from custom pricing plans that scale with your organization, including dedicated account management and priority support.",
        order: 2,
        createdAt: new Date(now - 3 * 864e5).toISOString(),
      },
      {
        id: "t9",
        topicId: "3",
        text: "All plans include a 14-day free trial with full access to features, allowing you to test our platform risk-free before committing.",
        order: 3,
        createdAt: new Date(now - 3 * 864e5).toISOString(),
      },

      {
        id: "t10",
        topicId: "4",
        text: "Security is our top priority. We use enterprise-grade encryption and comply with GDPR, SOC 2, and ISO 27001 standards to protect your data.",
        order: 1,
        createdAt: new Date(now - 2 * 864e5).toISOString(),
      },
      {
        id: "t11",
        topicId: "4",
        text: "All data is encrypted both in transit and at rest using AES-256 encryption, ensuring maximum security for your sensitive information.",
        order: 2,
        createdAt: new Date(now - 2 * 864e5).toISOString(),
      },
      {
        id: "t12",
        topicId: "4",
        text: "We conduct regular security audits and penetration testing to identify and address potential vulnerabilities before they become issues.",
        order: 3,
        createdAt: new Date(now - 2 * 864e5).toISOString(),
      },
    ];

    setTopics(mockTopics);
    setTexts(mockTexts);
    setLoading(false);
  }, []);

  // Memoized helpers
  const getTopicTexts = useCallback(
    (topicId: string) =>
      texts
        .filter((t) => t.topicId === topicId)
        .sort((a, b) => a.order - b.order),
    [texts]
  );

  // Topic dialog handlers
  const openTopicDialog = useCallback((topic?: CompanyTopic) => {
    if (topic) {
      setEditingTopic(topic);
      setTopicForm({ name: topic.name });
    } else {
      setEditingTopic(null);
      setTopicForm({ name: "" });
    }
    setTopicDialogOpen(true);
  }, []);

  const saveTopic = useCallback(() => {
    if (!topicForm.name.trim()) {
      error("Validation Error", "Topic name is required");
      return;
    }

    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) =>
          t.id === editingTopic.id
            ? {
                ...t,
                name: topicForm.name,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      success("Success", "Topic updated successfully");
    } else {
      const newTopic: CompanyTopic = {
        id: Date.now().toString(),
        name: topicForm.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTopics((prev) => [...prev, newTopic]);
      success("Success", "Topic created successfully");
    }

    setTopicDialogOpen(false);
    setTopicForm({ name: "" });
  }, [topicForm.name, editingTopic]);

  // Delete topic
  const deleteTopic = useCallback(() => {
    setDeleteDialog((state) => {
      if (!state || state.type !== "topic") return null;
      setTopics((prev) => prev.filter((t) => t.id !== state.id));
      setTexts((prev) => prev.filter((txt) => txt.topicId !== state.id));
      success("Success", "Topic deleted successfully");
      if (selectedTopic?.id === state.id) setSelectedTopic(null);
      return null;
    });
  }, [selectedTopic?.id]);

  // Text dialog handlers
  const openTextDialog = useCallback((text?: CompanyText) => {
    if (text) {
      setEditingText(text);
      setTextForm({ text: text.text });
    } else {
      setEditingText(null);
      setTextForm({ text: "" });
    }
    setTextDialogOpen(true);
  }, []);

  const saveText = useCallback(() => {
    if (!selectedTopic) {
      error("Error", "Please select a topic first");
      return;
    }
    if (!textForm.text.trim()) {
      error("Validation Error", "Text content is required");
      return;
    }

    if (editingText) {
      setTexts((prev) =>
        prev.map((txt) =>
          txt.id === editingText.id ? { ...txt, text: textForm.text } : txt
        )
      );
      success("Success", "Text updated successfully");
    } else {
      const newText: CompanyText = {
        id: Date.now().toString(),
        topicId: selectedTopic.id,
        text: textForm.text,
        order: getTopicTexts(selectedTopic.id).length + 1,
        createdAt: new Date().toISOString(),
      };
      setTexts((prev) => [...prev, newText]);
      success("Success", "Text created successfully");
    }

    setTextDialogOpen(false);
    setTextForm({ text: "" });
  }, [selectedTopic, textForm.text, editingText, getTopicTexts]);

  // Delete text
  const deleteText = useCallback(() => {
    setDeleteDialog((state) => {
      if (!state || state.type !== "text") return null;
      setTexts((prev) => prev.filter((txt) => txt.id !== state.id));
      success("Success", "Text deleted successfully");
      return null;
    });
  }, []);

  return {
    // state
    topics,
    texts,
    selectedTopic,
    loading,

    // dialogs
    topicDialogOpen,
    textDialogOpen,
    deleteDialog,

    // forms
    topicForm,
    textForm,
    editingTopic,
    editingText,

    // setters/handlers
    setTopicDialogOpen,
    setTextDialogOpen,
    setDeleteDialog,
    setTopicForm,
    setTextForm,
    openTopicDialog,
    openTextDialog,
    saveTopic,
    saveText,
    deleteTopic,
    deleteText,
    setSelectedTopic,
    getTopicTexts,
  };
}
