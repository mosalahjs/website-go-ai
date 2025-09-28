import Container from "@/components/shared/Container";
import { getTranslations, getLocale } from "next-intl/server";
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
