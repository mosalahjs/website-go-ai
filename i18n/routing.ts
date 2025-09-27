import { defineRouting } from "next-intl/routing";
import { i18n } from "./i18n-confige";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: i18n.locales.map((locale) => locale.code),
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
