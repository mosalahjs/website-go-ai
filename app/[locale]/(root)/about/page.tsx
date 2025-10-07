import ClientAbout from "./components/ClientAbout";
// import ClientAboutTest from "./components/ClientAboutTest";

export const metadata = {
  title: "About",
  description:
    "Learn more about GoAi 247 — the leading digital BPO provider in the Middle East, driven by innovation, AI, and customer excellence.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <ClientAbout />
      {/* <ClientAboutTest /> */}
    </div>
  );
}
