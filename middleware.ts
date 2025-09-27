import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const IntlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

export async function middleware(req: NextRequest) {
  return IntlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
