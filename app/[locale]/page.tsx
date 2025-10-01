import Container from "@/components/shared/Container";
import Services from "@/components/landing/Services";
import TechShowcase from "@/components/landing/TechShowCase";
import { Testimonials } from "@/components/landing/Testimonials";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <section>
      <Hero />
      <Container>
        <Services />
        <TechShowcase />
        <FeaturedProjects />
        <Testimonials />
      </Container>
    </section>
  );
}
