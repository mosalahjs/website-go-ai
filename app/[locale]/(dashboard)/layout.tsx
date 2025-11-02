// app/[locale]/(dashboard)/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import { Suspense } from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot:
      "noimageindex, max-image-preview:none, max-snippet:-1, max-video-preview:-1",
  },
};

const Sidebar = nextDynamic(() => import("./dashboard/components/Sidebar"), {
  ssr: true,
  loading: () => (
    <div className="w-64 shrink-0 border-r bg-card/50" aria-hidden>
      <div className="h-14 border-b" />
      <div className="p-3 space-y-2">
        <div className="h-8 rounded bg-muted" />
        <div className="h-8 rounded bg-muted" />
        <div className="h-8 rounded bg-muted" />
      </div>
    </div>
  ),
});

const Navbar = nextDynamic(() => import("./dashboard/components/Navbar"), {
  ssr: true,
  loading: () => <div className="h-14 border-b bg-card/50" aria-hidden />,
});

async function requireAuth(locale: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`);
  }
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  await requireAuth(locale);

  return (
    <section
      className="h-svh w-full bg-background text-foreground overflow-hidden"
      aria-label="Dashboard Shell"
    >
      <div className="flex h-full min-h-0 w-full overflow-hidden">
        <div className="sticky left-0 top-0 h-full shrink-0 self-start">
          <Suspense>
            <Sidebar />
          </Suspense>
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <Suspense>
            <Navbar />
          </Suspense>

          <main
            id="main"
            role="main"
            className="flex-1 min-h-0 overflow-y-auto focus:outline-none [scrollbar-gutter:stable]"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </section>
  );
}
