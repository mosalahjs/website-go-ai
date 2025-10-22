export const metadata = {
  title: "Chat",
  description: "Private chat section",
};

export default function ChatLayout({
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
