import Container from "@/components/shared/Container";
import { getTranslations, getLocale } from "next-intl/server";
import { RevealSection } from "@/components/shared/RevealSection";
import { Card, CardContent } from "@/components/ui/card";
import Landing from "@/components/landing";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return (
    <section>
      <Container>
        <Landing />
      </Container>
    </section>
  );
}
