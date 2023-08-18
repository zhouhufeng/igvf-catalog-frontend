import { Metadata } from 'next'
import './globals.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { Inter } from 'next/font/google'

import ReduxProvider from './_redux/provider'
import Footer from '@/components/Footer'
import Providers from './providers'

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
        <Providers>
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  )
}
