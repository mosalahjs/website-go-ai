import React from "react";
import { ContactForm } from "./components/ContactForm";
import Container from "@/components/shared/Container";
import { ContactHero } from "./components/ContactHero";
import { ContactInfo } from "./components/ContactInfo";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: "en" | "ar" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "Contact",
    description:
      "Get in touch with Go AI 247 — we’re here to help your business grow with AI-driven BPO solutions and innovative digital transformation services.",
    path: "/contact",
    locale,
  });
}

export default function Contact() {
  return (
    <Container>
      <ContactHero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 py-16">
        <ContactInfo />
        <ContactForm />
      </div>
    </Container>
  );
}
