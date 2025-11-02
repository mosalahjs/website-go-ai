import type { Page, Section } from "@/types/dashboard/content.type";

export const sectionTypes = [
  { value: "hero", label: "Hero Section" },
  { value: "features", label: "Features" },
  { value: "content", label: "Content Block" },
  { value: "cta", label: "Call to Action" },
  { value: "testimonials", label: "Testimonials" },
  { value: "gallery", label: "Gallery" },
  { value: "contact", label: "Contact Form" },
];

export const pageTemplates = [
  { value: "default", label: "Default" },
  { value: "landing", label: "Landing Page" },
  { value: "blog", label: "Blog Post" },
  { value: "service", label: "Service Page" },
];

export const uid = () => Math.random().toString(36).slice(2);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const sortSections = (list: Section[]) =>
  [...list].sort((a, b) => a.order - b.order);

export const getPageSections = (all: Section[], pageId: string) =>
  sortSections(all.filter((s) => s.pageId === pageId));

export const getSectionTypeLabel = (type: string) =>
  sectionTypes.find((t) => t.value === type)?.label || type;

export const seedMock = () => {
  const pages: Page[] = [
    {
      id: "1",
      title: "Homepage",
      slug: "home",
      status: "published",
      template: "landing",
      createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "About Us",
      slug: "about",
      status: "published",
      template: "default",
      createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
    },
    {
      id: "3",
      title: "Services",
      slug: "services",
      status: "published",
      template: "service",
      createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Contact",
      slug: "contact",
      status: "draft",
      template: "default",
      createdAt: new Date(Date.now() - 1 * 864e5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const sections: Section[] = [
    {
      id: "s1",
      pageId: "1",
      type: "hero",
      title: "Welcome to GoAI",
      subtitle: "AI-Powered Solutions for Modern Business",
      content:
        "Transform your business with cutting-edge artificial intelligence technology.",
      order: 1,
      visible: true,
      settings: { bgColor: "gradient", alignment: "center" },
    },
    {
      id: "s2",
      pageId: "1",
      type: "features",
      title: "Our Features",
      subtitle: "Everything you need to succeed",
      content:
        "Comprehensive AI solutions with advanced analytics, automation, and insights.",
      order: 2,
      visible: true,
      settings: { columns: 3, showIcons: true },
    },
    {
      id: "s3",
      pageId: "1",
      type: "cta",
      title: "Ready to Get Started?",
      subtitle: "Join thousands of satisfied customers",
      content: "Start your free trial today and experience the power of AI.",
      order: 3,
      visible: true,
      settings: { buttonText: "Get Started", buttonStyle: "primary" },
    },
    {
      id: "s4",
      pageId: "2",
      type: "content",
      title: "Our Story",
      subtitle: "Building the future of AI",
      content:
        "GoAI was founded with a mission to democratize artificial intelligence and make it accessible to businesses of all sizes.",
      order: 1,
      visible: true,
      settings: { layout: "single-column" },
    },
    {
      id: "s5",
      pageId: "3",
      type: "content",
      title: "Our Services",
      subtitle: "Comprehensive AI Solutions",
      content:
        "We offer a wide range of AI-powered services including natural language processing, computer vision, and predictive analytics.",
      order: 1,
      visible: true,
      settings: { layout: "two-column" },
    },
  ];

  return { pages, sections };
};
