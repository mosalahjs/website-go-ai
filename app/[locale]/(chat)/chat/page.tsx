import type { Metadata } from "next";
import ChatPageClient from "./components/ChatPageClient";
import ChatHeader from "./components/ChatHeader";
import { WEBSITE_NAME } from "@/constant";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChatPage.CHAT.PAGE");
  const title = t("titlePrefix", { site: WEBSITE_NAME });
  const description = t("description", { site: WEBSITE_NAME });

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: { canonical: "/chat" },
  };
}

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatPageClient />
    </div>
  );
}
