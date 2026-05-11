"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ConnectWallet } from "./ConnectWallet";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link
              href={`/${locale}`}
              className="text-xl font-bold text-primary-700"
            >
              SoroSave
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link
                href={`/${locale}/groups`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t("groups")}
              </Link>
              <Link
                href={`/${locale}/groups/new`}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t("createGroup")}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}
