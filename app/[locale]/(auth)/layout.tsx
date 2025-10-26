export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-svh h-svh bg-background overflow-hidden">
      {children}
    </section>
  );
}
