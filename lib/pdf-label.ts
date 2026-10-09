import jsPDF from 'jspdf'

export interface ShippingAddressData {
  customerName: string
  countryCode?: string
  phoneNumber: string
  alternatePhone?: string
  doorNoStreet: string
  localityLandmark?: string
  city: string
  state: string
  pincode: string // Pincode / Zipcode / Postal Code
  country?: string // Default 'India' or custom country
  isInternational?: boolean
}

export const BOUTIQUE_ADDRESS = {
  name: 'RAGAS BOUTIQUE',
  line1: '19/7, Singara Garden 5th Street',
  line2: 'Old Washermenpet',
  cityStatePincode: 'Chennai, Tamil Nadu - 600021',
  country: 'INDIA',
  phone: '+91 63825 30649',
}

/**
 * Generates an A5-sized Monochrome Professional Shipping Label PDF
 * Format: A5 Portrait (148mm x 210mm)
 */
export function generateA5ShippingLabelPDF(data: ShippingAddressData): jsPDF {
  // A5 dimensions in mm: width = 148, height = 210
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  })

  const width = 148
  const height = 210
  const isIntl = !!data.isInternational
  const countryName = (data.country || 'INDIA').toUpperCase()
  const codePrefix = data.countryCode ? (data.countryCode.startsWith('+') ? data.countryCode : `+${data.countryCode}`) : '+91'

  // --- MONOCHROME COLOR PALETTE (RGB Triplets) ---
  const COLOR_BLACK = 0
  const COLOR_DARK_GRAY = 40
  const COLOR_MID_GRAY = 100
  const COLOR_LIGHT_BG = 248

  // Outer Border Frame
  doc.setLineWidth(1.0)
  doc.setDrawColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(5, 5, width - 10, height - 10)

  // Double thin inner accent line
  doc.setLineWidth(0.3)
  doc.setDrawColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(6.5, 6.5, width - 13, height - 13)

  // Header Banner Box (Solid Black Header)
  doc.setFillColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(7, 7, width - 14, 22, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('RAGAS BOUTIQUE', width / 2, 17, { align: 'center' })
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  const bannerText = isIntl ? 'INTERNATIONAL PARCEL SHIPPING LABEL • UNSTITCHED FABRIC' : 'PARCEL SHIPPING LABEL • UNSTITCHED BLOUSE FABRIC'
  doc.text(bannerText, width / 2, 23, { align: 'center' })

  // --- TO ADDRESS SECTION (CUSTOMER) ---
  doc.setFillColor(COLOR_LIGHT_BG, COLOR_LIGHT_BG, COLOR_LIGHT_BG)
  doc.rect(8, 32, width - 16, 92, 'F')
  doc.setLineWidth(0.8)
  doc.setDrawColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(8, 32, width - 16, 92, 'S')

  // "DELIVER TO" Title Badge Header
  doc.setFillColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(8, 32, isIntl ? 65 : 45, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text(isIntl ? 'DELIVER TO (INTL):' : 'DELIVER TO:', 12, 38.5)

  // Customer Details
  doc.setTextColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(data.customerName.toUpperCase(), 14, 51)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(COLOR_DARK_GRAY, COLOR_DARK_GRAY, COLOR_DARK_GRAY)
  doc.text(`PH: ${codePrefix} ${data.phoneNumber}${data.alternatePhone ? ` / ${data.alternatePhone}` : ''}`, 14, 59)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(COLOR_DARK_GRAY, COLOR_DARK_GRAY, COLOR_DARK_GRAY)
  
  // Wrap address text neatly
  const addressLines = doc.splitTextToSize(
    `${data.doorNoStreet}${data.localityLandmark ? `, ${data.localityLandmark}` : ''}`,
    width - 32
  )
  doc.text(addressLines, 14, 67)

  const currentY = 67 + (addressLines.length * 5.5)
  doc.text(`${data.city}, ${data.state}`, 14, currentY)

  // COUNTRY & POSTAL CODE / PINCODE Box (High visibility Monochrome Box)
  doc.setFillColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(14, currentY + 4, width - 44, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  
  const zipLabel = isIntl ? `ZIP/POSTAL CODE: ${data.pincode}` : `PINCODE: ${data.pincode}`
  doc.text(zipLabel, 18, currentY + 11.5)
  doc.setFontSize(10)
  doc.text(`DESTINATION: ${countryName}`, 18, currentY + 16.5)

  // --- SEPARATOR LINE ---
  doc.setLineWidth(0.6)
  doc.setDrawColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.line(8, 128, width - 8, 128)

  // --- FROM ADDRESS SECTION (BOUTIQUE) ---
  doc.setFillColor(255, 255, 255)
  doc.rect(8, 132, width - 16, 58, 'F')
  doc.setLineWidth(0.6)
  doc.setDrawColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(8, 132, width - 16, 58, 'S')

  // "FROM" Title Badge Header
  doc.setFillColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.rect(8, 132, 40, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('FROM / SENDER:', 12, 137.5)

  // Sender Details
  doc.setTextColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(BOUTIQUE_ADDRESS.name, 14, 147)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(COLOR_DARK_GRAY, COLOR_DARK_GRAY, COLOR_DARK_GRAY)
  doc.text(BOUTIQUE_ADDRESS.line1, 14, 153)
  doc.text(BOUTIQUE_ADDRESS.line2, 14, 158)
  doc.text(`${BOUTIQUE_ADDRESS.cityStatePincode}, ${BOUTIQUE_ADDRESS.country}`, 14, 163)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(COLOR_BLACK, COLOR_BLACK, COLOR_BLACK)
  doc.text(`Phone / WhatsApp: ${BOUTIQUE_ADDRESS.phone}`, 14, 169)

  // Footer Courier Instructions
  doc.setFillColor(COLOR_LIGHT_BG, COLOR_LIGHT_BG, COLOR_LIGHT_BG)
  doc.rect(8, 178, width - 16, 10, 'F')
  doc.setLineWidth(0.3)
  doc.setDrawColor(COLOR_MID_GRAY, COLOR_MID_GRAY, COLOR_MID_GRAY)
  doc.rect(8, 178, width - 16, 10, 'S')
  doc.setTextColor(COLOR_DARK_GRAY, COLOR_DARK_GRAY, COLOR_DARK_GRAY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  const footerInstruction = isIntl ? 'INTERNATIONAL PARCEL • HANDLE WITH CARE • FRAGILE TEXTILE FABRIC' : 'HANDLE WITH CARE • FRAGILE TEXTILE FABRIC • SAME DAY DISPATCH'
  doc.text(footerInstruction, width / 2, 184.5, { align: 'center' })

  // Footer Branding / Credit
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(COLOR_MID_GRAY, COLOR_MID_GRAY, COLOR_MID_GRAY)
  doc.text('Generated via ragasboutique.in Shipping Label Creator', width / 2, 202, { align: 'center' })

  return doc
}
