import { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

import ReduxProvider from './_redux/provider'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IGVF Catalog',
  description: 'Browse the IGVF Catalog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Footer />
      </body>
    </html>
  )
}
