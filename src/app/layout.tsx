import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'JanSahayak AI — Your Government Benefits Assistant',
  description: 'AI-assisted central and state government welfare schemes discovery and eligibility evaluation for Indian citizens.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <AppProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
