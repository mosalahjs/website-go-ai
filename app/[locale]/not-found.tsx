import NotFoundClient from "@/components/shared/NotFoundClient";
import { createPageMetadata } from "@/lib/seo";
import { Metadata } from "next";

type Props = { params: Promise<{ locale: "en" | "ar" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "404 - Page Not Found",
    description:
      "Oops! The page you are looking for does not exist. Return to Go AI 247 home page.",
    path: "/404",
    locale,
  });
}

export default function NotFound() {
  return <NotFoundClient />;
}
