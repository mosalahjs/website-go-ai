import "../globals.css";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { getMessages } from "next-intl/server";
import { getDirection } from "@/i18n/i18n-confige";
// Providers
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
// Constant
import { WEBSITE_NAME } from "@/constant";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goai247.com"),
  title: {
    default: `${WEBSITE_NAME}`,
    template: `%s | ${WEBSITE_NAME}`,
  },
  description: `${WEBSITE_NAME} - Elevate Your Business with AI`,
  icons: {
    icon: "/logo/logo-light.svg",
    shortcut: "/logo/logo-light-png.png",
    apple: "/logo/logo-light-png.png",
  },
  openGraph: {
    title: `${WEBSITE_NAME}`,
    description: `${WEBSITE_NAME} - Elevate Your Business with AI`,
    url: "https://website-go-ai.vercel.app",
    siteName: `${WEBSITE_NAME}`,
    images: [
      {
        url: "/logo/logo-light-png.png",
        width: 1200,
        height: 630,
        alt: `${WEBSITE_NAME} Logo`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${WEBSITE_NAME}`,
    description: `${WEBSITE_NAME} - Elevate Your Business with AI`,
    images: ["/logo/logo-light-png.png"],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const dir = getDirection(locale);
  const messages = await getMessages({ locale });
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      dir={dir === "rtl" ? "rtl" : "ltr"}
    >
      <head>
        <meta
          name="description"
          content={`Learn more about ${WEBSITE_NAME} — AI-driven software solutions that accelerate business growth across the Middle East.`}
        />
      </head>
      <body
        className={`
    ${geistMono.variable} antialiased
    ${locale === "ar" ? ibmArabic.variable : inter.variable}
  `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
