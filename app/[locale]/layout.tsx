import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getDirection } from "@/i18n/i18n-confige";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Footer } from "@/components/footer";
import ScrollToTop from "@/components/shared/ScrollToTop";

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
  metadataBase: new URL("https://website-go-ai.vercel.app"),
  title: {
    default: "Go AI 247",
    template: "%s | Go AI 247",
  },
  description: "Go AI 247 - Elevate Your Business with AI",
  icons: {
    icon: "/logo/logo-light.svg",
    shortcut: "/logo/logo-light-png.png",
    apple: "/logo/logo-light-png.png",
  },
  openGraph: {
    title: "Go AI 247",
    description: "Go AI 247 - Elevate Your Business with AI",
    url: "https://website-go-ai.vercel.app",
    siteName: "Go Ai",
    images: [
      {
        url: "/logo/logo-light-png.png",
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
    title: "Go AI 247",
    description: "Go AI 247 - Elevate Your Business with AI",
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
            <Navbar />
            <main className="pt-18 min-h-screen">{children}</main>
            <Footer />
            <ScrollToTop />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
