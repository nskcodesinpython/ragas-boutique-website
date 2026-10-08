import type { Metadata } from 'next'
import './globals.css'
import { FloatingWhatsAppButton } from '@/components/common/FloatingWhatsAppButton'

export const metadata: Metadata = {
  title: 'Ragas Boutique | Handcrafted Designer Blouses & Custom Embroidery',
  description: 'Exquisite traditional silk, contemporary, and bridal blouses with custom tailoring and premium Zari embroidery by Ragas Boutique.',
  keywords: ['Ragas Boutique', 'designer blouse', 'custom saree blouse', 'Kanjeevaram silk blouse', 'bridal blouse', 'Zardozi embroidery', 'wedding blouse'],
  authors: [{ name: 'Ragas Boutique' }],
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  openGraph: {
    title: 'Ragas Boutique | Handcrafted Designer Blouses',
    description: 'Bespoke traditional and contemporary designer blouses tailored to perfection.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  )
}

