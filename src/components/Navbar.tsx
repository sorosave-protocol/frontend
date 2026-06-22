"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ConnectWallet } from "./ConnectWallet";

export function Navbar() {
  const t = useTranslations("nav");
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-700">
              SoroSave
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link
                href="/groups"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t("groups")}
              </Link>
              <Link
                href="/groups/new"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {t("create")}
              </Link>
            </div>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
