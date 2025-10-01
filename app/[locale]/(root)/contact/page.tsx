import React from "react";
import { ContactForm } from "./components/ContactForm";
import Container from "@/components/shared/Container";
import { ContactHero } from "./components/ContactHero";
import { ContactInfo } from "./components/ContactInfo";

export default function Contact() {
  return (
    <Container>
      <ContactHero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 py-16">
        <ContactInfo />
        <ContactForm />
      </div>
    </Container>
  );
}
