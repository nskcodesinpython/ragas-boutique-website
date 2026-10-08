import React from 'react'
import Link from 'next/link'
import { Sparkles, Scissors, Heart, Palette, MessageCircle, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'

export default function AboutPage() {
  const whatsappUrl = getWhatsAppLink(getGeneralInquiryMessage())

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="container-custom">
          
          {/* Hero Story Banner */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Legacy &amp; Craftsmanship</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              The Story Behind <span className="text-primary italic font-serif">RAGAS BOUTIQUE</span>
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed font-body">
              Located in Washermenpet, Chennai, <strong>RAGAS BOUTIQUE</strong> specializes exclusively in premium unstitched blouse fabric materials. We feature 3 signature fabric collections: <strong>Netted Tissue Fabric</strong>, <strong>Semi Silk Fabric</strong>, and <strong>Tissue Fabric</strong> with <strong>Same Day Dispatch</strong> on all orders.
            </p>
          </div>

          {/* Brand Philosophy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-gray-100 text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">Premium Unstitched Cuts</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Standard 1.0m to 1.2m unstitched fabric pieces providing your tailor with complete freedom for custom sleeves, necklines, and fits.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-gray-100 text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">3 Signature Fabric Types</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose from Netted Tissue Fabric, Semi Silk Fabric, and Tissue Fabric materials with rich zari borders and festive textures.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-gray-100 text-center">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">⚡ Same Day Dispatch</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fast order processing and instant order assistance via WhatsApp (+91 63825 30649) to get your fabric delivered quickly.
              </p>
            </div>

          </div>

          {/* Studio Showcase & CTA */}
          <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold">
                Find the Perfect Fabric for Your Saree
              </h2>
              <p className="text-gray-400 text-base">
                Whether you need a heavy bridal velvet Zardozi cut, Banarasi brocade material, or crisp Kanjeevaram silk fabric, explore our catalog today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link href="/products" className="btn-primary py-4 px-8 text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2">
                <span>Explore Fabrics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-4 px-8 text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

