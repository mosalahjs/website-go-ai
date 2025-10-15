import Container from "@/components/shared/Container";
import Services from "@/components/landing/Services";
import TechShowcase from "@/components/landing/TechShowCase";
import { Testimonials } from "@/components/landing/Testimonials";
import FeaturedProjects from "@/components/landing/FeaturedProjects";
import { Hero } from "@/components/landing/Hero";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Partners from "@/components/landing/partners/Partners";

type Props = { params: Promise<{ locale: "en" | "ar" }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    title: "Home",
    description:
      "Learn more about GoAi 247 — the leading digital BPO provider in the Middle East, driven by innovation, AI, and customer excellence.",
    path: "/",
    locale,
  });
}

export default function Home() {
  return (
    <section>
      <Hero />
      <Container>
        <TechShowcase />
        <Services />
        <FeaturedProjects />
        <Partners />
        {/* <Testimonials /> */}
      </Container>
    </section>
  );
}
