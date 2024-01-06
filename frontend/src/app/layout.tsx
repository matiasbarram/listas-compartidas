import AuthProviders from '@/providers/AuthProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';
import ToastProvider from '../components/common/ToastContainer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Listas compartidas',
  description: 'Crear listas que se pueden compartir con otras personas',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon.png',
  },
  themeColor: '#6466e9',
  colorScheme: 'dark',
  creator: 'matiasbarram',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className + ' w-full min-h-screen'}>
        <NextTopLoader color="#6366f1" />
        <AuthProviders>
          <ToastProvider>
            <ReactQueryProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              {children}
            </ReactQueryProvider>
          </ToastProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
