import { Metadata } from 'next'
import './globals.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { Inter } from 'next/font/google'

import Providers from './providers'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IGVF Catalog',
  description: 'Browse the IGVF Catalog',
}

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode,
  modal: React.ReactNode,
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className='flex flex-col h-screen justify-between'>
            <Header />
            <div className='mb-auto w-screen overflow-scroll flex-1 relative'>
              {children}
            </div>
          </div>
          {modal}
        </Providers>
      </body>
    </html>
  )
}
