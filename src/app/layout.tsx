import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";

export const metadata: Metadata = {
  title: "SoroSave — Decentralized Group Savings",
  description:
    "A decentralized rotating savings protocol built on Soroban. Create or join savings groups, contribute each cycle, and receive the pot when it's your turn.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
