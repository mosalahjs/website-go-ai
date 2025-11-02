"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Page, Section } from "@/types/dashboard/content.type";
import { toast } from "sonner";
import {
  getPageSections,
  getSectionTypeLabel,
  pageTemplates,
  sectionTypes,
  seedMock,
  slugify,
  uid,
} from "./content.utils";

export default function useContentManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [pageDialog, setPageDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    status: "draft" as "published" | "draft",
    template: "default",
  });

  const [sectionDialog, setSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({
    type: "content",
    title: "",
    subtitle: "",
    content: "",
    visible: true,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    type: "page" | "section";
    id: string;
  } | null>(null);

  // load mock
  useEffect(() => {
    setLoading(true);
    const { pages: P, sections: S } = seedMock();
    setPages(P);
    setSections(S);
    setLoading(false);
  }, []);

  const currentSections = useMemo(
    () => (selectedPage ? getPageSections(sections, selectedPage.id) : []),
    [sections, selectedPage]
  );

  // Page handlers
  const openPageDialog = useCallback((page?: Page) => {
    if (page) {
      setEditingPage(page);
      setPageForm({
        title: page.title,
        slug: page.slug,
        status: page.status,
        template: page.template,
      });
    } else {
      setEditingPage(null);
      setPageForm({
        title: "",
        slug: "",
        status: "draft",
        template: "default",
      });
    }
    setPageDialog(true);
  }, []);

  const savePage = useCallback(() => {
    if (!pageForm.title.trim() || !pageForm.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }

    if (editingPage) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingPage.id
            ? { ...p, ...pageForm, updatedAt: new Date().toISOString() }
            : p
        )
      );
      toast.success("Page updated successfully");
    } else {
      const now = new Date().toISOString();
      const newPage: Page = {
        id: uid(),
        ...pageForm,
        slug: slugify(pageForm.slug || pageForm.title),
        createdAt: now,
        updatedAt: now,
      };
      setPages((prev) => [...prev, newPage]);
      toast.success("Page created successfully");
    }

    setPageDialog(false);
    setPageForm({ title: "", slug: "", status: "draft", template: "default" });
  }, [editingPage, pageForm]);

  const requestDeletePage = useCallback((pageId: string) => {
    setDeleteDialog({ type: "page", id: pageId });
  }, []);

  const deletePage = useCallback(() => {
    if (!deleteDialog || deleteDialog.type !== "page") return;
    const id = deleteDialog.id;

    setPages((prev) => prev.filter((p) => p.id !== id));
    setSections((prev) => prev.filter((s) => s.pageId !== id));
    setSelectedPage((prev) => (prev?.id === id ? null : prev));
    setDeleteDialog(null);
    toast.success("Page deleted successfully");
  }, [deleteDialog]);

  // Section handlers
  const openSectionDialog = useCallback(
    (section?: Section) => {
      if (!selectedPage && !section) {
        toast.error("Please select a page first");
        return;
      }
      if (section) {
        setEditingSection(section);
        setSectionForm({
          type: section.type,
          title: section.title,
          subtitle: section.subtitle || "",
          content: section.content,
          visible: section.visible,
        });
      } else {
        setEditingSection(null);
        setSectionForm({
          type: "content",
          title: "",
          subtitle: "",
          content: "",
          visible: true,
        });
      }
      setSectionDialog(true);
    },
    [selectedPage]
  );

  const saveSection = useCallback(() => {
    if (!selectedPage) {
      toast.error("Please select a page first");
      return;
    }
    if (!sectionForm.title.trim()) {
      toast.error("Section title is required");
      return;
    }

    if (editingSection) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSection.id ? { ...s, ...sectionForm } : s
        )
      );
      toast.success("Section updated successfully");
    } else {
      const newSection: Section = {
        id: uid(),
        pageId: selectedPage.id,
        ...sectionForm,
        order: currentSections.length + 1,
        settings: {},
      };
      setSections((prev) => [...prev, newSection]);
      toast.success("Section created successfully");
    }

    setSectionDialog(false);
    setSectionForm({
      type: "content",
      title: "",
      subtitle: "",
      content: "",
      visible: true,
    });
  }, [currentSections.length, editingSection, sectionForm, selectedPage]);

  const requestDeleteSection = useCallback((sectionId: string) => {
    setDeleteDialog({ type: "section", id: sectionId });
  }, []);

  const deleteSection = useCallback(() => {
    if (!deleteDialog || deleteDialog.type !== "section") return;
    const id = deleteDialog.id;
    setSections((prev) => prev.filter((s) => s.id !== id));
    setDeleteDialog(null);
    toast.success("Section deleted successfully");
  }, [deleteDialog]);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s))
    );
  }, []);

  return {
    // state
    pages,
    sections,
    selectedPage,
    loading,

    // dialogs state
    pageDialog,
    editingPage,
    pageForm,
    sectionDialog,
    editingSection,
    sectionForm,
    deleteDialog,

    // setters
    setSelectedPage,
    setPageDialog,
    setSectionDialog,
    setDeleteDialog,
    setPageForm,
    setSectionForm,

    // derived
    currentSections,
    sectionTypes,
    pageTemplates,
    getSectionTypeLabel,

    // actions
    openPageDialog,
    savePage,
    requestDeletePage,
    deletePage,

    openSectionDialog,
    saveSection,
    requestDeleteSection,
    deleteSection,
    toggleSectionVisibility,
  };
}
