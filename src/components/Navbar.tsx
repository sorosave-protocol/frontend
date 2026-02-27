"use client";

import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-700 dark:text-primary-400">
              SoroSave
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link
                href="/groups"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Groups
              </Link>
              <Link
                href="/groups/new"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Create Group
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}
