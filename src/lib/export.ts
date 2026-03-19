import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContributionRecord {
  date: string;
  member: string;
  amount: string;
  round: number;
  status: "paid" | "pending";
  txHash?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCSV(headers: string[], rows: string[][]): string {
  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ];
  return lines.join("\n");
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

export function exportContributionsCSV(
  group: SavingsGroup,
  contributions: ContributionRecord[]
): void {
  const headers = ["Date", "Member", "Amount", "Round", "Status", "Tx Hash"];
  const rows = contributions.map((c) => [
    c.date,
    c.member,
    c.amount,
    String(c.round),
    c.status,
    c.txHash ?? "",
  ]);

  const csv = toCSV(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${group.name.replace(/\s+/g, "-")}-contributions.csv`);
}

// ---------------------------------------------------------------------------
// PDF export — plain HTML → print window (no external deps)
// ---------------------------------------------------------------------------

export function exportGroupSummaryPDF(
  group: SavingsGroup,
  contributions: ContributionRecord[]
): void {
  const rows = contributions
    .map(
      (c) => `
      <tr>
        <td>${c.date}</td>
        <td style="font-family:monospace;font-size:11px">${c.member.slice(0, 16)}…</td>
        <td>${c.amount}</td>
        <td>${c.round}</td>
        <td>${c.status}</td>
        <td style="font-family:monospace;font-size:10px">${c.txHash ? c.txHash.slice(0, 12) + "…" : "—"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${group.name} — Group Summary</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 32px; color: #111; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .meta { color: #555; font-size: 13px; margin-bottom: 24px; }
  .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
  .info-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
  .info-box dt { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-box dd { font-size: 15px; font-weight: 600; margin-top: 2px; }
  h2 { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #f9fafb; text-align: left; padding: 6px 10px; border-bottom: 2px solid #e5e7eb; font-weight: 600; }
  td { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; }
  tr:last-child td { border-bottom: none; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
<h1>${group.name}</h1>
<p class="meta">Generated ${new Date().toLocaleDateString()} · Status: ${getStatusLabel(group.status)}</p>

<div class="info-grid">
  <dl class="info-box">
    <dt>Contribution Amount</dt>
    <dd>${formatAmount(group.contributionAmount)} tokens</dd>
  </dl>
  <dl class="info-box">
    <dt>Members</dt>
    <dd>${group.members.length} / ${group.maxMembers}</dd>
  </dl>
  <dl class="info-box">
    <dt>Round</dt>
    <dd>${group.currentRound} / ${group.totalRounds || group.maxMembers}</dd>
  </dl>
  <dl class="info-box">
    <dt>Created</dt>
    <dd>${formatDate(group.createdAt)}</dd>
  </dl>
</div>

<h2>Contribution History</h2>
${
  contributions.length === 0
    ? "<p style='color:#6b7280;font-size:13px'>No contributions recorded yet.</p>"
    : `<table>
  <thead><tr>
    <th>Date</th><th>Member</th><th>Amount</th><th>Round</th><th>Status</th><th>Tx Hash</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>`
}
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
