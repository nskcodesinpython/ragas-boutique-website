import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'

export function Footer() {
  const whatsappUrl = getWhatsAppLink(getGeneralInquiryMessage())

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-32 h-20 flex-shrink-0">
                <Image 
                  src="/images/logo.svg" 
                  alt="Ragas Boutique Logo" 
                  fill 
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium unstitched saree blouse fabric materials. Featuring Netted Tissue, Semi Silk &amp; Tissue fabrics with Same Day Dispatch.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://www.instagram.com/ragas_boutique16"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-primary text-gray-300 hover:text-white rounded-full transition-colors flex items-center gap-1.5 px-3"
                title="Follow @ragas_boutique16 on Instagram"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-xs font-semibold">@ragas_boutique16</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 hover:bg-[#25D366] text-gray-300 hover:text-white rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition-colors">Product Catalog</Link></li>
              <li><Link href="/address" className="hover:text-secondary transition-colors">Submit Delivery Address</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-white tracking-wide">Fabric Collections</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-secondary transition-colors">Netted Tissue Fabric</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition-colors">Semi Silk Fabric</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition-colors">Tissue Fabric</Link></li>
              <li className="text-xs text-amber-400 font-bold pt-1">⚡ Same Day Dispatch</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-white tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/SGr4GxyJcnJufSYu6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition-colors"
                >
                  19/7, Singara Garden 5th street, Old Washermenpet, Chennai - 600021
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">
                  +91 63825 30649
                </a>
              </li>
              <li className="flex items-center space-x-3 text-xs text-emerald-400 font-semibold">
                <span>⏰ 09:00 - 19:30 (Mon-Sat) | Sun: Closed</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RAGAS BOUTIQUE. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Premium Unstitched Blouse Fabrics • Same Day Dispatch</p>
        </div>
      </div>
    </footer>
  )
}

