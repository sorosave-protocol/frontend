"use client";

import { useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('sorosave_locale') as Locale;
    if (stored && locales.includes(stored)) {
      setLocale(stored);
    }
  }, []);

  const handleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('sorosave_locale', newLocale);
    window.location.reload();
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value as Locale)}
      className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
