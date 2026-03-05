import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { Navbar } from '@/src/components/Navbar';
import "../globals.css";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 1. Validar el idioma (solo permitimos 'en' o 'es')
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 2. Cargar los mensajes correspondientes al idioma
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
