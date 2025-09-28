"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {["ar", "en"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLocale(lng)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300
            ${
              locale === lng
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                : "bg-white/10 text-foreground hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white"
            }`}
        >
          {lng === "ar" ? "العربية" : "English"}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
