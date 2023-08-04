import GoogleProvider from './providers/GoogleProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!)
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleProvider>
          {children}
        </GoogleProvider>
      </body>
    </html>
  )
}
