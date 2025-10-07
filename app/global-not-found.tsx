import NotFoundClient from "@/components/shared/NotFoundClient";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Go AI 247 - Page Not Found",
  description: "Oops! The page you are looking for does not exist. Go AI 247.",
};

export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages({ locale });
  return (
    <html>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NotFoundClient />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
