import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreProvider } from '@/context/StoreContext'
import { UserProvider } from '@/context/UserContext'
import { DoorTransition } from '@/components/door-transition'
import { CalculatorDialog } from '@/components/interiors/calculator-dialog'
import { Toaster } from 'sonner'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: 'swap'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Banaya | Interior Design & Decor Studio',
  description: 'Where architecture breathes and every room tells its story. Premium interior design and handcrafted decor pieces.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <UserProvider>
          <StoreProvider>
            <Toaster position="top-center" richColors />
            <DoorTransition />
            <CalculatorDialog />
            {children}
            <Analytics />
          </StoreProvider>
        </UserProvider>
      </body>
    </html>
  )
}
