import React from 'react';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProviders from './providers/AuthProvider'
import { ReactNode } from 'react'
import ToastProvider from './components/common/ToastContainer'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Listas compartidas',
  description: 'Crear listas que se pueden compartir con otras personas',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className + ' w-full min-h-screen'}>
        <NextTopLoader
          color='#6366f1'
        />
        <AuthProviders>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProviders>
      </body>
    </html >
  )
}
