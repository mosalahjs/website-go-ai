import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { getDirection } from "@/i18n/i18n-confige";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Go Ai",
    template: "%s | Go Ai",
  },
  description: "Go Ai - The Future of development",
  icons: {
    icon: "/logo/logo-light.svg",
    shortcut: "/logo/logo-light-png.png",
    apple: "/logo/logo-light-png.png",
  },
  openGraph: {
    title: "Go Ai",
    description: "Go Ai - The Future of development",
    url: "https://website-go-ai.vercel.app",
    siteName: "Go Ai",
    images: [
      {
        url: "/logo/logo-og.png",
        width: 1200,
        height: 630,
        alt: "Go Ai Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Ai",
    description: "Go Ai - The Future of development",
    images: ["/logo/logo-og.png"],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // const locale = await getLocale();
  const { locale } = await params;
  const dir = getDirection(locale);
  const messages = await getMessages({ locale });
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      dir={dir === "rtl" ? "rtl" : "ltr"}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />

          <main className="pt-24 min-h-[400vh]">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
