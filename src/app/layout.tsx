
import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AppProviders } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

const geistSans = GeistSans({
  variable: '--font-geist-sans',
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'], // Include necessary weights
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'A modern platform for content creation and management.',
  keywords: ['blog', 'content management', 'cms', 'publishing'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppProviders>
          <Navbar />
          <main className="flex-grow container py-8">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
