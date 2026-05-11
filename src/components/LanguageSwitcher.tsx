"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { isLocale, locales, type Locale } from "@/i18n/config";

const localeLabels: Record<Locale, "en" | "fr"> = {
  en: "en",
  fr: "fr",
};

function getLocalizedPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/");

  if (isLocale(segments[1])) {
    segments[1] = nextLocale;
  } else {
    segments.splice(1, 0, nextLocale);
  }

  return segments.join("/") || `/${nextLocale}`;
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("language");

  return (
    <div className="flex items-center gap-1" aria-label={t("label")}>
      {locales.map((nextLocale) => {
        const active = nextLocale === locale;

        return (
          <Link
            key={nextLocale}
            href={getLocalizedPath(pathname, nextLocale)}
            aria-current={active ? "true" : undefined}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {t(localeLabels[nextLocale])}
          </Link>
        );
      })}
    </div>
  );
}
