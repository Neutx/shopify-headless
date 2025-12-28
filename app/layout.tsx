import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import PublicLayout from '@/components/layout/PublicLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Headless Kreo',
  description: 'Blazing-fast headless e-commerce powered by Shopify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <PublicLayout>{children}</PublicLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

