"use client";

import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";
import { useOnboardingTour } from "@/app/providers";

export function Navbar() {
  const { startTour } = useOnboardingTour();

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
                Groups
              </Link>
              <Link
                href="/groups/new"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Create Group
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={startTour}
              className="hidden rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
            >
              Replay Tour
            </button>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}
