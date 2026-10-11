import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <span className="text-sm font-semibold tracking-wider uppercase text-primary-600 mb-2">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        Savings group or page missing
      </h1>

      <p className="text-base text-gray-600 max-w-md mb-8">
        The savings circle, member profile, or link you are looking for doesn't exist or has moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/groups"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Browse Savings Groups
        </Link>
      </div>
    </div>
  );
}
