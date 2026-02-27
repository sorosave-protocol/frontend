/**
 * Export utilities for SoroSave
 * Supports CSV and PDF export for group history and contribution records
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types for export data
export interface ContributionRecord {
  date: string;
  amount: number;
  member: string;
  roundStatus: string;
}

export interface GroupSummary {
  groupName: string;
  totalMembers: number;
  totalSaved: number;
  contributions: ContributionRecord[];
  createdAt: string;
}

/**
 * Export contribution history to CSV
 */
export function exportToCSV(data: GroupSummary, filename?: string): void {
  const headers = ['Date', 'Amount', 'Member', 'Round Status'];
  const rows = data.contributions.map(c => [
    c.date,
    c.amount.toString(),
    c.member,
    c.roundStatus,
  ]);

  // Add summary header
  const summaryRows = [
    [`Group: ${data.groupName}`],
    [`Total Members: ${data.totalMembers}`],
    [`Total Saved: ${data.totalSaved}`],
    [`Created: ${data.createdAt}`],
    [], // Empty row
    headers,
    ...rows,
  ];

  // Create CSV content
  const csvContent = summaryRows
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Download
  downloadFile(
    csvContent,
    filename || `${data.groupName}_contributions.csv`,
    'text/csv'
  );
}

/**
 * Export group summary to PDF
 */
export function exportToPDF(data: GroupSummary, filename?: string): void {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text(data.groupName, 14, 22);
  
  // Summary info
  doc.setFontSize(12);
  doc.text(`Total Members: ${data.totalMembers}`, 14, 35);
  doc.text(`Total Saved: $${data.totalSaved.toLocaleString()}`, 14, 42);
  doc.text(`Created: ${data.createdAt}`, 14, 49);
  
  // Contribution table
  autoTable(doc, {
    startY: 60,
    head: [['Date', 'Amount', 'Member', 'Round Status']],
    body: data.contributions.map(c => [
      c.date,
      `$${c.amount.toLocaleString()}`,
      c.member,
      c.roundStatus,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });
  
  // Save
  doc.save(filename || `${data.groupName}_summary.pdf`);
}

/**
 * Export button component helper
 */
export function getExportButtons(groupData: GroupSummary) {
  return [
    {
      label: 'Export CSV',
      onClick: () => exportToCSV(groupData),
    },
    {
      label: 'Export PDF',
      onClick: () => exportToPDF(groupData),
    },
  ];
}

/**
 * Helper to download file
 */
function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format contribution data for export
 */
export function formatContributionData(
  contributions: Array<{
    createdAt: string | Date;
    amount: number;
    memberName: string;
    roundNumber: number;
    status: string;
  }>
): ContributionRecord[] {
  return contributions.map(c => ({
    date: new Date(c.createdAt).toLocaleDateString(),
    amount: c.amount,
    member: c.memberName,
    roundStatus: `Round ${c.roundNumber} - ${c.status}`,
  }));
}