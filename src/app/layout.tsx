import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoroSave — Decentralized Group Savings",
  description:
    "A decentralized rotating savings protocol built on Soroban. Create or join savings groups, contribute each cycle, and receive the pot when it's your turn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
