import { Suspense } from "react";
import type { Metadata } from "next";

import { DashboardClientSkeleton } from "./components/skeletons";
import DashboardClient from "./components/DashboardClient";

export const dynamic = "force-dynamic"; // or "auto" if you add real data fetching

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Chatbot Dashboard",
    description: "Manage conversations and insights",
    openGraph: {
      title: "Chatbot Dashboard",
      description: "Manage conversations",
    },
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardClientSkeleton />}>
      {/* Pass initial data from server to client wrapper */}
      <DashboardClient />
    </Suspense>
  );
}
