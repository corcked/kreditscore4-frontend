import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KreditScore4',
  description: 'Авторизация через Telegram Bot',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
              © 2024 KreditScore4. Все права защищены.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 