import React from "react";
import Container from "@/components/shared/Container";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import BlogsPage from "./components/BlogCard";

type Props = { params: Promise<{ locale: "en" | "ar" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "Blogs",
    description:
      "Get in touch with Go AI 247 — we’re here to help your business grow with AI-driven BPO solutions and innovative digital transformation services.",
    path: "/blogs",
    locale,
  });
}

export default function Blogs() {
  return (
    <Container>
      <BlogsPage />
    </Container>
  );
}
