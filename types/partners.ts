import type { StaticImageData } from "next/image";

export type Partner = {
  name: string;
  title: string;
  description: string;
  logo?: string | StaticImageData | null;
  image?: string | StaticImageData | null;
  gradientFrom: string;
  gradientTo: string;
  bgGlow: string;
  accentColor: string;
  year: string;
  exploreUrl?: string;
};

export type Partner_Simple = {
  name: string;
  title: string;
  description: string;
  logo: StaticImageData | string;
  image: StaticImageData | null;
  gradientFrom: string;
  gradientTo: string;
  bgGlow: string;
  accentColor: string;
  year: string;
  link: string;
  logoBg: string;
};
