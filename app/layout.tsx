import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SessionProvider } from '@/components/ui/SessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { CursorEffect } from '@/components/CursorEffect'

import './globals.css'

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
})

// ── Viewport must be a separate export in Next.js 13+ ──────────────────────
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

// ── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: 'Mohammed Bilal Sheikh — Python Backend Engineer',
    description:
        'Dark cinematic portfolio showcasing high-performance systems, scalable APIs, and data-driven engineered solutions.',
    keywords: [
        'Mohammed Bilal Sheikh',
        'Backend Engineer',
        'Python Developer',
        'API Design',
        'Systems Architecture',
        'Portfolio',
    ],
    icons: {
        icon: '/bilkil.jpeg',
    },
    authors: [{ name: 'Mohammed Bilal Sheikh', url: 'https://github.com/Bilal2001' }],
    creator: 'Mohammed Bilal Sheikh',
    openGraph: {
        title: 'Mohammed Bilal Sheikh — Python Backend Engineer',
        description:
            'Dark cinematic portfolio showcasing high-performance systems, scalable APIs, and data-driven engineered solutions.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Mohammed Bilal Sheikh — Python Backend Engineer',
        description: 'Dark cinematic portfolio showcasing high-performance systems and scalable APIs.',
    },
    robots: {
        index: true,
        follow: true,
    },
}

// ── Root Layout ─────────────────────────────────────────────────────────────
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