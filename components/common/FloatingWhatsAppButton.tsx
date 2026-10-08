'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'

export function FloatingWhatsAppButton() {
  const whatsappUrl = getWhatsAppLink(getGeneralInquiryMessage())

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5B] text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block pr-1">
        Chat with Us
      </span>
    </a>
  )
}

