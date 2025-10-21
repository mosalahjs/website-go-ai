import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ChatbotAnimated from "@/components/shared/ChatbotAnimated";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Navbar />
      <main className="pt-18 min-h-screen">{children}</main>
      <Footer />
      <ScrollToTop />
      <ChatbotAnimated />
    </div>
  );
}
