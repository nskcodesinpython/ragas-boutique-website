import type { Metadata } from 'next'
import './globals.css'
import { FloatingWhatsAppButton } from '@/components/common/FloatingWhatsAppButton'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL('https://ragasboutique.in'),
  title: {
    default: 'Ragas Boutique | Premium Unstitched Blouse Fabrics in Chennai',
    template: '%s | Ragas Boutique',
  },
  description:
    'Discover premium unstitched blouse fabric materials at Ragas Boutique, Washermenpet, Chennai. Featuring Netted Tissue Fabric, Semi Silk, and Tissue fabric cuts with Same Day Dispatch across India and Worldwide.',
  keywords: [
    'Ragas Boutique',
    'Ragas Boutique Chennai',
    'unstitched blouse fabric',
    'designer blouse material',
    'netted tissue fabric',
    'semi silk blouse material',
    'tissue fabric blouse',
    'saree blouse fabric online',
    'blouse material Washermenpet',
    'designer blouse material Chennai',
    'same day dispatch blouse fabric',
    'Aari work blouse material',
    'hand embroidery blouse fabric',
    'premium blouse material',
    'bridal aari work blouse fabric',
    'semi bridal blouse material',
  ],
  authors: [{ name: 'Ragas Boutique' }],
  creator: 'Ragas Boutique',
  publisher: 'Ragas Boutique',
  alternates: {
    canonical: 'https://ragasboutique.in',
  },
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  openGraph: {
    title: 'Ragas Boutique | Premium Unstitched Blouse Fabrics in Chennai',
    description:
      'Shop boutique unstitched blouse materials (Netted Tissue, Semi Silk & Tissue Fabric). Same day dispatch available.',
    url: 'https://ragasboutique.in',
    siteName: 'Ragas Boutique',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ragas Boutique | Premium Unstitched Blouse Fabrics',
    description:
      'Shop unstitched blouse materials (Netted Tissue, Semi Silk & Tissue Fabric) with Same Day Dispatch.',
  },
  verification: {
    google: 'googled461bded23794e33',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Ragas Boutique',
    image: 'https://ragasboutique.in/images/logo.svg',
    url: 'https://ragasboutique.in',
    telephone: '+916382530649',
    priceRange: '₹400 - ₹4000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '19/7, Singara Garden 5th Street, Old Washermenpet',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600021',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '13.1119',
      longitude: '80.2882',
    },
    sameAs: ['https://www.instagram.com/ragas_boutique16'],
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <FloatingWhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}

