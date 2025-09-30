import Container from "@/components/shared/Container";
import Landing from "@/components/landing";
import Services from "@/components/landing/Services";
import TechShowcase from "@/components/landing/TechShowCase";
import { Testimonials } from "@/components/landing/Testimonials";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";

export default function Home() {
  return (
    <section>
      <Container>
        <Landing />
        <Services />
        <TechShowcase />
        <FeaturedProjects />
        <Testimonials />
      </Container>
    </section>
  );
}
