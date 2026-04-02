/**
 * Export utilities for SoroSave group data.
 * Supports CSV and PDF export of contribution history and group summaries.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContributionRecord {
  date: string;
  member: string;
  amount: string;
  round: number;
  status: string;
}

export interface GroupSummary {
  groupName: string;
  groupId: number;
  admin: string;
  token: string;
  contributionAmount: string;
  cycleLengthDays: number;
  totalRounds: number;
  currentRound: number;
  memberCount: number;
  maxMembers: number;
  status: string;
  createdAt: string;
  contributions: ContributionRecord[];
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

/**
 * Convert contribution records to a CSV string.
 */
export function contributionsToCSV(
  contributions: ContributionRecord[],
  groupName: string,
): string {
  const header = ["Date", "Member", "Amount", "Round", "Status"];
  const rows = contributions.map((c) => [
    c.date,
    c.member,
    c.amount,
    String(c.round),
    c.status,
  ]);

  const csvContent = [
    `# SoroSave - ${groupName} - Contribution History`,
    `# Exported: ${new Date().toISOString()}`,
    "",
    header.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  return csvContent;
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCSV(
  contributions: ContributionRecord[],
  groupName: string,
): void {
  const csv = contributionsToCSV(contributions, groupName);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `sorosave-${slugify(groupName)}-contributions.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// PDF Export
// ---------------------------------------------------------------------------

/**
 * Generate and download a PDF summary report for a group.
 * Uses the browser print API to produce a styled PDF without external deps.
 */
export function downloadPDF(summary: GroupSummary): void {
  const html = buildPDFHtml(summary);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export PDF reports.");
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to render before triggering print
  printWindow.onload = () => {
    printWindow.print();
  };
}

function buildPDFHtml(summary: GroupSummary): string {
  const contributionRows = summary.contributions
    .map(
      (c) => `
      <tr>
        <td>${escapeHtml(c.date)}</td>
        <td>${escapeHtml(c.member)}</td>
        <td>${escapeHtml(c.amount)}</td>
        <td>${c.round}</td>
        <td>${escapeHtml(c.status)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SoroSave Report - ${escapeHtml(summary.groupName)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { color: #4f46e5; font-size: 24px; margin-bottom: 8px; }
    .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 32px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .summary-label { color: #6b7280; }
    .summary-value { font-weight: 600; }
    h2 { font-size: 18px; margin: 24px 0 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f9fafb; text-align: left; padding: 8px 12px; border-bottom: 2px solid #e5e7eb; }
    td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; text-align: center; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>SoroSave Group Report</h1>
  <p class="subtitle">${escapeHtml(summary.groupName)} &mdash; Exported ${new Date().toLocaleDateString()}</p>

  <div class="summary-grid">
    <div class="summary-item"><span class="summary-label">Group ID</span><span class="summary-value">${summary.groupId}</span></div>
    <div class="summary-item"><span class="summary-label">Status</span><span class="summary-value">${escapeHtml(summary.status)}</span></div>
    <div class="summary-item"><span class="summary-label">Admin</span><span class="summary-value">${escapeHtml(truncateAddress(summary.admin))}</span></div>
    <div class="summary-item"><span class="summary-label">Contribution</span><span class="summary-value">${escapeHtml(summary.contributionAmount)} tokens</span></div>
    <div class="summary-item"><span class="summary-label">Cycle</span><span class="summary-value">${summary.cycleLengthDays} days</span></div>
    <div class="summary-item"><span class="summary-label">Round</span><span class="summary-value">${summary.currentRound} / ${summary.totalRounds}</span></div>
    <div class="summary-item"><span class="summary-label">Members</span><span class="summary-value">${summary.memberCount} / ${summary.maxMembers}</span></div>
    <div class="summary-item"><span class="summary-label">Created</span><span class="summary-value">${escapeHtml(summary.createdAt)}</span></div>
  </div>

  <h2>Contribution History</h2>
  ${
    summary.contributions.length === 0
      ? '<p style="color:#9ca3af;">No contributions recorded yet.</p>'
      : `<table>
    <thead>
      <tr><th>Date</th><th>Member</th><th>Amount</th><th>Round</th><th>Status</th></tr>
    </thead>
    <tbody>${contributionRows}</tbody>
  </table>`
  }

  <div class="footer">
    Generated by SoroSave &mdash; Decentralized Group Savings on Soroban
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] || c);
}

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
