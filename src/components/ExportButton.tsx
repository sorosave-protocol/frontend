"use client";

import { useState } from "react";
import {
  downloadCSV,
  downloadPDF,
  type ContributionRecord,
  type GroupSummary,
} from "@/lib/export";

interface ExportButtonProps {
  /** Group summary data used for PDF export. */
  groupSummary: GroupSummary;
  /** Optional additional CSS classes. */
  className?: string;
}

/**
 * Export button with dropdown for CSV and PDF export.
 * Place this on the group detail page or dashboard.
 */
export function ExportButton({ groupSummary, className = "" }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  async function handleExportCSV() {
    setExporting("csv");
    setIsOpen(false);
    try {
      downloadCSV(groupSummary.contributions, groupSummary.groupName);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportPDF() {
    setExporting("pdf");
    setIsOpen(false);
    try {
      downloadPDF(groupSummary);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting !== null}
        className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>{exporting ? "Exporting..." : "Export"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <button
            onClick={handleExportCSV}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 rounded-t-lg flex items-center space-x-3"
          >
            <span className="text-green-600 font-mono text-xs font-bold bg-green-50 px-2 py-0.5 rounded">
              CSV
            </span>
            <div>
              <p className="font-medium text-gray-900">Export CSV</p>
              <p className="text-xs text-gray-500">Contribution history</p>
            </div>
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 rounded-b-lg flex items-center space-x-3 border-t"
          >
            <span className="text-red-600 font-mono text-xs font-bold bg-red-50 px-2 py-0.5 rounded">
              PDF
            </span>
            <div>
              <p className="font-medium text-gray-900">Export PDF</p>
              <p className="text-xs text-gray-500">Group summary report</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
