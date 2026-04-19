import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface Contribution {
  date: string;
  amount: string;
  member: string;
  round: number;
}

interface GroupMember {
  id: string;
  name: string;
  address: string;
}

interface GroupData {
  id: string;
  name: string;
  description: string;
  contributionAmount: string;
  currentRound: number;
  totalRounds: number;
  members: GroupMember[];
  contributions: Contribution[];
  status: string;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: string): string {
  const value = parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function generateCSV(data: GroupData): string {
  const headers = ["Date", "Amount", "Member", "Round"];
  const rows = data.contributions.map((c) => [
    formatDate(c.date),
    formatCurrency(c.amount),
    c.member,
    c.round,
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(",")),
  ].join("\n");
  
  return csvContent;
}

function generatePDF(data: GroupData): string {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text("SoroSave Group Summary Report", 14, 20);
  
  // Group Info
  doc.setFontSize(12);
  doc.text(`Group: ${data.name}`, 14, 30);
  doc.text(`Description: ${data.description}`, 14, 38);
  doc.text(`Status: ${data.status}`, 14, 46);
  doc.text(`Contribution Amount: ${formatCurrency(data.contributionAmount)}`, 14, 54);
  doc.text(`Current Round: ${data.currentRound} of ${data.totalRounds}`, 14, 62);
  
  // Members
  doc.setFontSize(14);
  doc.text("Group Members", 14, 75);
  doc.setFontSize(10);
  data.members.forEach((member, index) => {
    doc.text(`${index + 1}. ${member.name} (${member.address})`, 14, 83 + index * 6);
  });
  
  // Contributions Table
  doc.setFontSize(14);
  doc.text("Contribution History", 14, 120);
  
  const tableData = data.contributions.map((c) => [
    formatDate(c.date),
    formatCurrency(c.amount),
    c.member,
    c.round.toString(),
  ]);
  
  doc.autoTable({
    head: [["Date", "Amount", "Member", "Round"]],
    body: tableData,
    startY: 130,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  return doc.output("dataurlstring");
}

export function exportGroupData(data: GroupData, format: "csv" | "pdf"): void {
  if (format === "csv") {
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sorosave-group-${data.id}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  } else if (format === "pdf") {
    const pdfData = generatePDF(data);
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `sorosave-group-${data.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  }
}

export function exportContributionHistory(contributions: Contribution[]): void {
  const csvContent = [
    ["Date", "Amount", "Member", "Round"].join(","),
    ...contributions.map(c => [
      formatDate(c.date),
      formatCurrency(c.amount),
      c.member,
      c.round.toString(),
    ].join(",")),
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sorosave-contributions-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}