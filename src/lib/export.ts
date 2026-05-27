/**
 * Export utilities for SoroSave
 * Issue #60 — Add data export feature (CSV/PDF)
 */

export interface ContributionRecord {
  round: number;
  member: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "missed";
}

export interface GroupExportData {
  groupName: string;
  admin: string;
  totalRounds: number;
  currentRound: number;
  members: string[];
  payoutOrder: string[];
  cycleLength: number;
  contributionAmount: string;
  contributions: ContributionRecord[];
}

// ── CSV Export ────────────────────────────────────────────────────────────────

export function exportToCSV(data: GroupExportData): void {
  const headers = ["Round", "Member", "Amount", "Date", "Status"];

  const rows = data.contributions.map((c) => [
    String(c.round),
    c.member,
    c.amount,
    c.date,
    c.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${data.groupName.replace(/\s+/g, "_")}_contributions.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── PDF Export ────────────────────────────────────────────────────────────────

export async function exportToPDF(data: GroupExportData): Promise<void> {
  // Build an HTML string and use the browser's print-to-PDF
  const html = buildPDFHTML(data);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to export PDF.");
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for resources then trigger print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}

function buildPDFHTML(data: GroupExportData): string {
  const memberRows = data.members
    .map(
      (m, i) =>
        `<tr>
          <td>${i + 1}</td>
          <td style="font-family:monospace;font-size:11px">${m}</td>
          <td>${data.payoutOrder.indexOf(m) + 1}</td>
        </tr>`
    )
    .join("");

  const contributionRows = data.contributions
    .map(
      (c) =>
        `<tr>
          <td>${c.round}</td>
          <td style="font-family:monospace;font-size:10px">${c.member.slice(0, 12)}...${c.member.slice(-4)}</td>
          <td>${c.amount}</td>
          <td>${c.date}</td>
          <td style="color:${c.status === "paid" ? "green" : c.status === "pending" ? "orange" : "red"}">${c.status.toUpperCase()}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SoroSave — ${data.groupName} Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
    h1 { color: #4f46e5; margin-bottom: 4px; }
    .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .section { margin-bottom: 28px; }
    h2 { font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f3f4f6; text-align: left; padding: 8px 10px; }
    td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .meta-item { background: #f9fafb; padding: 12px 16px; border-radius: 8px; }
    .meta-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; }
    .meta-value { font-size: 18px; font-weight: 700; margin-top: 2px; }
    .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>SoroSave Group Report</h1>
  <div class="subtitle">Generated on ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</div>

  <div class="meta-grid">
    <div class="meta-item">
      <div class="meta-label">Group Name</div>
      <div class="meta-value">${data.groupName}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Round Progress</div>
      <div class="meta-value">${data.currentRound} / ${data.totalRounds}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Members</div>
      <div class="meta-value">${data.members.length}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Contribution / Cycle</div>
      <div class="meta-value">${data.contributionAmount}</div>
    </div>
  </div>

  <div class="section">
    <h2>Members & Payout Order</h2>
    <table>
      <thead><tr><th>#</th><th>Wallet Address</th><th>Payout Round</th></tr></thead>
      <tbody>${memberRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>Contribution History</h2>
    <table>
      <thead><tr><th>Round</th><th>Member</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${contributionRows || '<tr><td colspan="5" style="color:#9ca3af;text-align:center">No contribution records yet</td></tr>'}</tbody>
    </table>
  </div>

  <div class="footer">SoroSave — Decentralized Group Savings on Stellar · sorosave-protocol</div>
</body>
</html>`;
}
