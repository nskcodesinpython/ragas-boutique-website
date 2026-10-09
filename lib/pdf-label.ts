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
 * Generates an A5-sized Parcel Shipping Label PDF (Domestic & International)
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

  // Outer Border Box
  doc.setLineWidth(1.2)
  doc.setDrawColor(180, 20, 60) // Primary Maroon/Rose color
  doc.rect(5, 5, width - 10, height - 10)

  // Header Banner
  doc.setFillColor(180, 20, 60)
  doc.rect(5, 5, width - 10, 22, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.text('RAGAS BOUTIQUE', width / 2, 15, { align: 'center' })
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  const bannerText = isIntl ? 'INTERNATIONAL PARCEL SHIPPING LABEL • UNSTITCHED FABRIC' : 'PARCEL SHIPPING LABEL • UNSTITCHED BLOUSE FABRIC'
  doc.text(bannerText, width / 2, 21, { align: 'center' })

  // --- TO ADDRESS SECTION (CUSTOMER) ---
  doc.setFillColor(252, 248, 245)
  doc.rect(8, 30, width - 16, 92, 'F')
  doc.setLineWidth(0.8)
  doc.setDrawColor(180, 20, 60)
  doc.rect(8, 30, width - 16, 92, 'S')

  // "DELIVER TO" Title Badge
  doc.setFillColor(180, 20, 60)
  doc.rect(8, 30, isIntl ? 65 : 45, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text(isIntl ? 'DELIVER TO (INTL):' : 'TO ADDRESS:', 12, 36.5)

  // Customer Details
  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(data.customerName.toUpperCase(), 14, 49)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(180, 20, 60)
  doc.text(`PH: ${codePrefix} ${data.phoneNumber}${data.alternatePhone ? ` / ${data.alternatePhone}` : ''}`, 14, 57)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(40, 40, 40)
  
  // Wrap address text neatly
  const addressLines = doc.splitTextToSize(
    `${data.doorNoStreet}${data.localityLandmark ? `, ${data.localityLandmark}` : ''}`,
    width - 32
  )
  doc.text(addressLines, 14, 65)

  const currentY = 65 + (addressLines.length * 5.5)
  doc.text(`${data.city}, ${data.state}`, 14, currentY)

  // COUNTRY & POSTAL CODE / PINCODE Box (High visibility for international customs & couriers)
  doc.setFillColor(180, 20, 60)
  doc.rect(14, currentY + 4, width - 44, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  
  const zipLabel = isIntl ? `ZIP/POSTAL CODE: ${data.pincode}` : `PINCODE: ${data.pincode}`
  doc.text(zipLabel, 18, currentY + 11.5)
  doc.setFontSize(10)
  doc.text(`DESTINATION: ${countryName}`, 18, currentY + 16.5)

  // --- SEPARATOR LINE ---
  doc.setLineWidth(0.5)
  doc.setDrawColor(200, 200, 200)
  doc.line(8, 126, width - 8, 126)

  // --- FROM ADDRESS SECTION (BOUTIQUE) ---
  doc.setFillColor(245, 245, 245)
  doc.rect(8, 130, width - 16, 60, 'F')
  doc.setLineWidth(0.5)
  doc.setDrawColor(150, 150, 150)
  doc.rect(8, 130, width - 16, 60, 'S')

  // "FROM" Title Badge
  doc.setFillColor(60, 60, 60)
  doc.rect(8, 130, 40, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('FROM / SENDER:', 12, 135.5)

  // Sender Details
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(BOUTIQUE_ADDRESS.name, 14, 146)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.text(BOUTIQUE_ADDRESS.line1, 14, 152)
  doc.text(BOUTIQUE_ADDRESS.line2, 14, 157)
  doc.text(`${BOUTIQUE_ADDRESS.cityStatePincode}, ${BOUTIQUE_ADDRESS.country}`, 14, 162)
  
  doc.setFont('helvetica', 'bold')
  doc.text(`Phone / WhatsApp: ${BOUTIQUE_ADDRESS.phone}`, 14, 168)

  // Footer Tagline / Instructions for Courier
  doc.setFillColor(240, 240, 240)
  doc.rect(8, 177, width - 16, 10, 'F')
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  const footerInstruction = isIntl ? 'INTERNATIONAL PARCEL • HANDLE WITH CARE • FRAGILE TEXTILE FABRIC' : 'HANDLE WITH CARE • FRAGILE TEXTILE FABRIC • SAME DAY DISPATCH'
  doc.text(footerInstruction, width / 2, 183.5, { align: 'center' })

  // Footer Page Credit
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text('Generated via ragasboutique.in Shipping Label Creator', width / 2, 202, { align: 'center' })

  return doc
}
