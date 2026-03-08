import type { Metadata, Viewport } from 'next'
import { Lora, Cinzel_Decorative } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const lora = Lora({ 
  subsets: ["latin"],
  variable: '--font-lora',
  display: 'swap',
});

const cinzel = Cinzel_Decorative({ 
  subsets: ["latin"],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El Oráculo de los Espejos | Un Viaje por la Identidad Perdida',
  description: 'Una experiencia literaria inmersiva que explora la identidad a través de El Conde de Montecristo, Dr. Jekyll y Mr. Hyde, y La Cándida Eréndira. Proyecto del Colegio Real Royal School.',
  generator: 'v0.app',
  keywords: ['literatura', 'tarot', 'identidad', 'Montecristo', 'Jekyll', 'Hyde', 'Eréndira', 'García Márquez', 'Dumas', 'Stevenson'],
  authors: [{ name: 'Juan Esteban, Valerie y Santiago' }],
  icons: {
    icon: [
      {
        url: '/icon-dark-32x32.png',
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

export const viewport: Viewport = {
  themeColor: '#1a1025',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${lora.variable} ${cinzel.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
