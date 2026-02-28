/**
 * Data Export Module
 * Support CSV and PDF export for group history and contribution records
 */

import { sorosaveClient } from "./sorosave";

export interface ContributionRecord {
  date: string;
  member: string;
  amount: number;
  status: "pending" | "completed" | "failed";
}

export interface GroupSummary {
  name: string;
  createdAt: string;
  totalMembers: number;
  totalContributions: number;
  roundNumber: number;
  currentPool: number;
}

/**
 * Export contributions to CSV format
 */
export function exportToCSV(contributions: ContributionRecord[], filename: string): void {
  const headers = ["Date", "Member", "Amount", "Status"];
  const rows = contributions.map(c => [
    c.date,
    c.member,
    c.amount.toString(),
    c.status
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

/**
 * Export group summary to PDF (simplified - actual PDF requires library like jsPDF)
 */
export async function exportToPDF(summary: GroupSummary, contributions: ContributionRecord[]): Promise<void> {
  // Build HTML content for PDF
  const html = buildPDFHTML(summary, contributions);
  
  // For now, download as HTML that can be printed to PDF
  downloadFile(html, `${summary.name}_report.html`, "text/html");
  
  console.log("PDF export: HTML downloaded. Use browser print to save as PDF.");
}

/**
 * Build HTML content for PDF export
 */
function buildPDFHTML(summary: GroupSummary, contributions: ContributionRecord[]): string {
  const contributionsRows = contributions.map(c => `
    <tr>
      <td>${c.date}</td>
      <td>${c.member}</td>
      <td>${c.amount}</td>
      <td>${c.status}</td>
    </tr>
  `).join("");
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Group Report - ${summary.name}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-item { background: #f9f9f9; padding: 15px; border-radius: 8px; }
    .summary-item h3 { margin: 0 0 5px 0; font-size: 14px; color: #666; }
    .summary-item p { margin: 0; font-size: 24px; font-weight: bold; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>Group Savings Report</h1>
  <p>Generated: ${new Date().toLocaleDateString()}</p>
  
  <div class="summary">
    <div class="summary-item">
      <h3>Total Members</h3>
      <p>${summary.totalMembers}</p>
    </div>
    <div class="summary-item">
      <h3>Total Contributions</h3>
      <p>${summary.totalContributions}</p>
    </div>
    <div class="summary-item">
      <h3>Current Pool</h3>
      <p>${summary.currentPool}</p>
    </div>
  </div>
  
  <h2>Contribution History</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Member</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${contributionsRows}
    </tbody>
  </table>
  
  <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
    Print / Save as PDF
  </button>
</body>
</html>
  `.trim();
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Fetch and export group data
 */
export async function exportGroupData(groupId: string, format: "csv" | "pdf"): Promise<void> {
  try {
    // Get group info
    const groupInfo = await sorosaveClient.getGroupInfo(groupId);
    
    // Build summary
    const summary: GroupSummary = {
      name: groupInfo.name || "Group",
      createdAt: new Date().toISOString(),
      totalMembers: groupInfo.members?.length || 0,
      totalContributions: groupInfo.totalContributions || 0,
      roundNumber: groupInfo.currentRound || 1,
      currentPool: groupInfo.poolAmount || 0
    };
    
    // Mock contribution data (replace with actual API call)
    const contributions: ContributionRecord[] = [
      { date: "2026-01-15", member: "Alice", amount: 100, status: "completed" },
      { date: "2026-01-22", member: "Bob", amount: 100, status: "completed" },
      { date: "2026-01-29", member: "Charlie", amount: 100, status: "completed" }
    ];
    
    if (format === "csv") {
      exportToCSV(contributions, `${summary.name}_contributions`);
    } else {
      await exportToPDF(summary, contributions);
    }
    
    console.log(`Exported ${format.toUpperCase()} for group ${groupId}`);
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}
