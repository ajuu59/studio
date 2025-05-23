import type { Metadata } from 'next';
import { Geist_Sans, Geist_Mono, Merriweather } from 'next/font/google'; // Corrected import for Geist_Sans
import './globals.css';
import { AppProviders } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

const geistSans = Geist_Sans({ // Corrected usage
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
    <html lang="en" suppressHydrationWarning>
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
