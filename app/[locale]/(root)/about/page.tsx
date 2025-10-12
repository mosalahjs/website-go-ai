import { Metadata } from "next";
import ClientAbout from "./components/ClientAbout";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: "en" | "ar" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "About",
    description:
      "Learn more about GoAi 247 — the leading digital BPO provider in the Middle East, driven by innovation, AI, and customer excellence.",
    path: "/about",
    locale,
  });
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <ClientAbout />
    </div>
  );
}
