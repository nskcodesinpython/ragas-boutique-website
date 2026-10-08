import { Product } from '@/types'

// WhatsApp Business Number - REPLACE WITH YOUR ACTUAL NUMBER
export const WHATSAPP_NUMBER = '916382530649' // Format: country code + number (no + or spaces)

/**
 * Generate WhatsApp link with pre-filled message
 */
export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

/**
 * Get product inquiry message for WhatsApp
 */
export function getProductInquiryMessage(product: Product): string {
  return `Hi! I'm interested in purchasing ${product.name} (SKU: ${product.sku}).

Could you please confirm:
- Color & stock availability
- Same Day Dispatch details

Thank you!`
}

/**
 * Get general inquiry message
 */
export function getGeneralInquiryMessage(): string {
  return `Hi! I'm interested in your designer blouses. I'd like to know more about your collections.`
}

/**
 * Get custom order inquiry message
 */
export function getCustomOrderMessage(): string {
  return `Hi! I'd like to inquire about a custom blouse order. Could we discuss the details?`
}
