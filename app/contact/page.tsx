'use client'

import React from 'react'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'

export default function ContactPage() {
  const whatsappUrl = getWhatsAppLink(getGeneralInquiryMessage())

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-12 md:py-20">
        <div className="container-custom">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Get in Touch with Us
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We&apos;d love to hear from you! Reach out for fabric availability, custom meter cuts, saree matching advice, or any questions about our blouse material catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details Left */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-gray-100 space-y-6">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">Studio Information</h3>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Boutique Address</h4>
                    <p className="text-sm text-gray-600 mt-1">19/7, Singara Garden 5th street, Old Washermenpet, Chennai - 600021</p>
                    <a
                      href="https://maps.app.goo.gl/SGr4GxyJcnJufSYu6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline mt-1 inline-block"
                    >
                      📍 Open in Google Maps ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Phone &amp; WhatsApp</h4>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-700 hover:text-primary mt-0.5 block">
                      +91 63825 30649
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Store Operating Hours</h4>
                    <p className="text-sm text-gray-600 mt-1">Monday – Saturday: 09:00 AM – 07:30 PM</p>
                    <p className="text-xs text-red-600 font-semibold mt-0.5">Sunday: Closed</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">⚡ Same Day Dispatch</span>
                    <span className="font-semibold text-gray-500">Unstitched Fabrics Only</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Card */}
              <div className="p-8 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-center">
                <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">Instant WhatsApp Order Support</h3>
                <p className="text-xs text-gray-600 mb-6">Chat directly with us on WhatsApp for fabric availability and quick orders.</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 63825 30649)</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form Right */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Send an Inquiry</h3>
              <p className="text-sm text-gray-500 mb-6">Fill out your details below and our team will respond promptly.</p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 Phone number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-2">Message or Inquiry</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the design, fabric, or occasion you need a blouse for..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

