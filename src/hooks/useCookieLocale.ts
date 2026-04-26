"use client";

import { locales, defaultLocale, type Locale } from "@/i18n/request";

/**
 * Reads the current locale from the `locale` cookie on the client side.
 * Falls back to the defaultLocale if the cookie is absent or invalid.
 */
export function useCookieLocale(): Locale {
  if (typeof document === "undefined") return defaultLocale;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="));
  const value = match?.split("=")?.[1];

  return value && locales.includes(value as Locale)
    ? (value as Locale)
    : defaultLocale;
}
