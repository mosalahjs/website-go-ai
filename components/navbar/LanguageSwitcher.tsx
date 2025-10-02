"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { i18n } from "@/i18n/i18n-confige";
import { Link, usePathname } from "@/i18n/routing";

const LanguageSwitcher: React.FC = React.memo(() => {
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);

  const languages = React.useMemo(() => i18n.locales, []);

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-md"
      >
        {currentLang?.name}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute mt-2 w-44 py-2 rounded-lg bg-white dark:bg-gray-950 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {languages.map((lng) => (
              <motion.li
                key={lng.code}
                whileHover={{ backgroundColor: "rgba(59,130,246,0.1)" }}
                className={`px-3 py-2 text-base cursor-pointer ${
                  locale === lng.code
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <Link
                  className="size-full block"
                  href={pathname}
                  locale={lng.code}
                  onClick={() => setOpen(false)}
                >
                  {lng.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;
