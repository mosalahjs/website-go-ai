import type { Metadata } from "next";

export const SITE = {
  name: "Go AI 247",
  baseUrl: "https://website-go-ai.vercel.app",
  defaultImage: "/logo/logo-light-png.png",
  defaultDescription: "Go AI 247 - Elevate Your Business with AI",
  twitterHandle: "@goai247",
  locales: ["en", "ar"] as const,
};
type Locale = (typeof SITE.locales)[number];

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  locale?: Locale;
};

export function buildUrl(path?: string, locale?: string) {
  const p = path?.startsWith("/") ? path : `/${path ?? ""}`;
  const prefix = locale ? `/${locale}` : "";
  return new URL(`${prefix}${p}`, SITE.baseUrl).toString();
}

export function createPageMetadata({
  title,
  description = SITE.defaultDescription,
  path = "/",
  image = SITE.defaultImage,
  locale,
}: PageMetaInput): Metadata {
  const url = buildUrl(path, locale);

  return {
    title,
    description,
    metadataBase: new URL(SITE.baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE.name} - ${title}`,
        },
      ],
      locale: locale === "ar" ? "ar" : "en",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
      creator: SITE.twitterHandle,
    },
    icons: {
      icon: "/logo/logo-light.svg",
      shortcut: "/logo/logo-light-png.png",
      apple: "/logo/logo-light-png.png",
    },
  };
}
