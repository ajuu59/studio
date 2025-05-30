import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AppProviders } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

// GeistSans and GeistMono are objects, not functions to be called.
// Their .variable property gives the CSS variable name.

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
  description: 'A blog where you can read about Artifical Intelligence and happenings in industry.',
  keywords: ['blog', 'content management', 'cms', 'publishing', 'ai', 'automation', 'testing'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${merriweather.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppProviders>
          <Navbar />
          <main className="flex-grow container mx-auto py-8">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
