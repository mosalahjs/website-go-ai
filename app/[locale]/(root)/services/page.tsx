import React from "react";
import ClientServices from "./components/ClientServices";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: "en" | "ar" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "Services",
    description:
      "Discover Go AI 247’s cutting-edge AI-powered business process outsourcing (BPO) services, designed to boost efficiency, innovation, and customer satisfaction.",
    path: "/services",
    locale,
  });
}

export default function Services() {
  return (
    <div>
      <ClientServices />
    </div>
  );
}
