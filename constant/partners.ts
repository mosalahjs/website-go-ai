import type { Partner, Partner_Simple } from "@/types/partners";

export const PARTNERS: Partner[] = [
  {
    name: "e&",
    title: "Leading Telecommunications Provider",
    description:
      "Pioneering next-generation digital connectivity and innovative telecommunication solutions across the Middle East region with cutting-edge 5G technology and smart infrastructure.",
    logo: "/assets/partner-eand-logo.svg",
    gradientFrom: "#E31E24",
    gradientTo: "#B71C1C",
    bgGlow: "rgba(227, 30, 36, 0.15)",
    accentColor: "rgb(227, 30, 36)",
    year: "2024",
    exploreUrl: "https://www.eand.com/",
  },
  {
    name: "Forbes Middle East",
    title: "Premier Business Publication",
    description:
      "The region's most authoritative voice in business journalism, showcasing influential leaders, groundbreaking innovations, and transformative companies shaping the Middle East economy.",
    image: "/assets/partner-forbes-2025.jpg",
    gradientFrom: "#D4AF37",
    gradientTo: "#C9A227",
    bgGlow: "rgba(212, 175, 55, 0.15)",
    accentColor: "rgb(212, 175, 55)",
    year: "2025",
    exploreUrl: "https://www.forbesmiddleeast.com/",
  },
  {
    name: "The First Group",
    title: "Luxury Hospitality Excellence",
    description:
      "Defining luxury in the hospitality sector with world-class hotel properties, exquisite dining experiences, and unparalleled service standards that set new benchmarks in premium hospitality.",
    image: "/assets/partner-tfg-2025.jpg",
    gradientFrom: "#B8976A",
    gradientTo: "#8B7355",
    bgGlow: "rgba(184, 151, 106, 0.15)",
    accentColor: "rgb(184, 151, 106)",
    year: "2023",
    exploreUrl: "https://www.thefirstgroup.com/",
  },
];

export const PARTNERS_SIMPLE: ReadonlyArray<Partner_Simple> = [
  {
    name: "e&",
    title: "Leading Telecommunications Provider",
    description:
      "Pioneering next-generation digital connectivity and innovative telecommunication solutions across the Middle East region with cutting-edge 5G technology and smart infrastructure.",
    logo: "/assets/partner-eand-logo.svg",
    image: null,
    gradientFrom: "#E31E24",
    gradientTo: "#B71C1C",
    bgGlow: "rgba(227, 30, 36, 0.15)",
    accentColor: "rgb(227, 30, 36)",
    year: "2024",
    link: "https://www.eand.com",
    logoBg: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
  },
  {
    name: "Forbes Middle East",
    title: "Premier Business Publication",
    description:
      "The region's most authoritative voice in business journalism, showcasing influential leaders, groundbreaking innovations, and transformative companies shaping the Middle East economy.",
    logo: "/assets/partner-forbes-logo.svg",
    image: null,
    gradientFrom: "#D4AF37",
    gradientTo: "#C9A227",
    bgGlow: "rgba(212, 175, 55, 0.15)",
    accentColor: "rgb(212, 175, 55)",
    year: "2025",
    link: "https://www.forbesmiddleeast.com",
    logoBg: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
  },
  {
    name: "The First Group",
    title: "Luxury Hospitality Excellence",
    description:
      "Defining luxury in the hospitality sector with world-class hotel properties, exquisite dining experiences, and unparalleled service standards that set new benchmarks in premium hospitality.",
    logo: "/assets/partner-tfg-logo.png",
    image: null,
    gradientFrom: "#B8976A",
    gradientTo: "#8B7355",
    bgGlow: "rgba(184, 151, 106, 0.15)",
    accentColor: "rgb(184, 151, 106)",
    year: "2023",
    link: "https://www.thefirstgroup.com",
    logoBg: "linear-gradient(135deg, #0f0f0f, #1f1f1f)",
  },
] as const;

export const nameToKey: Record<string, "eand" | "forbes" | "tfg"> = {
  "e&": "eand",
  "Forbes Middle East": "forbes",
  "The First Group": "tfg",
};
