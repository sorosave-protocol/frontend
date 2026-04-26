"use client";

import { useTransition } from "react";
import { locales, type Locale } from "@/i18n/request";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  function switchLocale(locale: Locale) {
    startTransition(() => {
      document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center space-x-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          disabled={isPending || locale === currentLocale}
          aria-label={`Switch to ${locale === "en" ? "English" : "Spanish"}`}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            locale === currentLocale
              ? "bg-primary-700 text-white cursor-default"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
