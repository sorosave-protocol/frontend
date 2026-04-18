"use client";

import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet";

export function Navbar() {
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
                id="tour-groups-link"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Groups
              </Link>
              <Link
                href="/groups/new"
                id="tour-create-group"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Create Group
              </Link>
              <button
                onClick={() => {
                  import('@/components/OnboardingTour').then((mod) => mod.restartTour());
                }}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center gap-1"
                title="Restart guided tour"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Help
              </button>
            </div>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
