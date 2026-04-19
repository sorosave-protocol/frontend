import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import './pwa'; // Add this line

const APP_NAME = "SoroSave";
const APP_DESCRIPTION = "Decentralized rotating savings protocol";

// Add this metadata
const APP_MANIFEST = "/manifest.json";

// Update metadata
const metadata: Metadata = {
  title: "SoroSave — Decentralized Group Savings",
  description: APP_DESCRIPTION,
  manifest: APP_MANIFEST,
  themeColor: "#22c55e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`
    },
    description: APP_DESCRIPTION
  }
};

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}