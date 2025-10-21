import Container from "@/components/shared/Container";

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
      <Container fullHeight overflow="hidden" className="flex flex-col">
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </Container>
    </section>
  );
}
