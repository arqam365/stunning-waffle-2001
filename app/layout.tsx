import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SessionProvider } from '@/components/ui/SessionProvider'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'
import {CursorEffect} from "@/components/CursorEffect";
import {GridCursorTrail} from "@/components/GridCursorTrail";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Mohammed Bilal Sheikh - Python Backend Engineer',
  description: 'Dark cinematic portfolio showcasing high-performance systems, scalable APIs, and engineered solutions.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
      <SessionProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <CursorEffect />
          {children}
        </ThemeProvider>
      </SessionProvider>
      </body>
      </html>
  )
}