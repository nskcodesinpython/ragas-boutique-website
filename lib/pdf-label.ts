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
 * Generates an A7-sized Monochrome Professional Shipping Label PDF
 * Format: A7 Portrait (74mm x 105mm)
 * Compact, high-contrast, thermal/laser parcel sticker format
 */
export function generateA7ShippingLabelPDF(data: ShippingAddressData): jsPDF {
  // A7 dimensions in mm: width = 74, height = 105
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a7',
  })

  const width = 74
  const height = 105
  const isIntl = !!data.isInternational
  const countryName = (data.country || 'INDIA').toUpperCase()
  const codePrefix = data.countryCode
    ? data.countryCode.startsWith('+')
      ? data.countryCode
      : `+${data.countryCode}`
    : '+91'

  // --- MONOCHROME PALETTE ---
  const C_BLACK = 0
  const C_DARK = 35
  const C_LIGHT_BG = 247

  // --- OUTER BORDER & INNER ACCENT FRAME ---
  doc.setLineWidth(0.6)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(2.5, 2.5, width - 5, height - 5)

  doc.setLineWidth(0.2)
  doc.rect(3.5, 3.5, width - 7, height - 7)

  // --- HEADER BANNER ---
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.8, 3.8, width - 7.6, 11, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text('RAGAS BOUTIQUE', width / 2, 8.8, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5)
  const headerSubtitle = isIntl
    ? 'INTERNATIONAL PRIORITY PARCEL LABEL'
    : 'PRIORITY PARCEL SHIPPING LABEL'
  doc.text(headerSubtitle, width / 2, 12.6, { align: 'center' })

  // --- RECIPIENT / DELIVER TO BOX ---
  // Box bounds: x=4, y=16.5, w=66, h=51
  const toBoxY = 16.5
  const toBoxH = 52.5
  doc.setFillColor(C_LIGHT_BG, C_LIGHT_BG, C_LIGHT_BG)
  doc.rect(4, toBoxY, width - 8, toBoxH, 'F')
  doc.setLineWidth(0.4)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4, toBoxY, width - 8, toBoxH, 'S')

  // "DELIVER TO" Title Tab
  const badgeWidth = isIntl ? 34 : 26
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4, toBoxY, badgeWidth, 5.2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.text(isIntl ? 'DELIVER TO (INTL):' : 'DELIVER TO:', 6, toBoxY + 3.8)

  // Customer Name
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  const safeName = (data.customerName || 'VALUED CUSTOMER').trim().toUpperCase()
  const nameLines = doc.splitTextToSize(safeName, width - 12)
  doc.text(nameLines, 6, toBoxY + 9.5)

  // Phone Number Line
  const phoneY = toBoxY + 9.5 + nameLines.length * 3.6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(C_DARK, C_DARK, C_DARK)
  const altText = data.alternatePhone ? ` / ${data.alternatePhone}` : ''
  const phoneStr = `PH: ${codePrefix} ${data.phoneNumber}${altText}`
  const phoneLines = doc.splitTextToSize(phoneStr, width - 12)
  doc.text(phoneLines, 6, phoneY)

  // Address Lines
  let addrY = phoneY + phoneLines.length * 3.2 + 0.5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(C_DARK, C_DARK, C_DARK)

  const rawStreet = `${data.doorNoStreet || ''}${data.localityLandmark ? `, ${data.localityLandmark}` : ''}`
  const streetLines = doc.splitTextToSize(rawStreet, width - 12)
  // Print max 3 lines of street to keep layout neat
  const visibleStreetLines = streetLines.slice(0, 3)
  doc.text(visibleStreetLines, 6, addrY)

  addrY += visibleStreetLines.length * 2.9
  const cityState = `${data.city || ''}, ${data.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
  const cityStateLines = doc.splitTextToSize(cityState, width - 12)
  doc.text(cityStateLines.slice(0, 2), 6, addrY)

  // High-Contrast Postal / Destination Badge inside TO Box
  const codeBoxY = toBoxY + toBoxH - 10.2
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(5.5, codeBoxY, width - 11, 8.6, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  const zipText = isIntl ? `POSTAL: ${data.pincode}` : `PIN: ${data.pincode}`
  doc.text(zipText, 7.5, codeBoxY + 4)

  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text(`DEST: ${countryName}`, 7.5, codeBoxY + 7.2)

  // --- SENDER / FROM ADDRESS SECTION ---
  // Box bounds: x=4, y=70.5, w=66, h=25
  const fromBoxY = 70.2
  const fromBoxH = 24.2
  doc.setFillColor(255, 255, 255)
  doc.rect(4, fromBoxY, width - 8, fromBoxH, 'F')
  doc.setLineWidth(0.35)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4, fromBoxY, width - 8, fromBoxH, 'S')

  // "FROM / SENDER" Title Tab
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4, fromBoxY, 23, 4.4, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.8)
  doc.text('FROM / SENDER:', 5.5, fromBoxY + 3.2)

  // Sender Details
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text(BOUTIQUE_ADDRESS.name, 6, fromBoxY + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5.5)
  doc.setTextColor(C_DARK, C_DARK, C_DARK)
  doc.text(`${BOUTIQUE_ADDRESS.line1}, ${BOUTIQUE_ADDRESS.line2}`, 6, fromBoxY + 11.8)
  doc.text(`${BOUTIQUE_ADDRESS.cityStatePincode}, ${BOUTIQUE_ADDRESS.country}`, 6, fromBoxY + 15)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFontSize(5.8)
  doc.text(`Ph / WA: ${BOUTIQUE_ADDRESS.phone}`, 6, fromBoxY + 19)

  // --- FOOTER STRIP ---
  const footerY = 95.8
  doc.setFillColor(C_LIGHT_BG, C_LIGHT_BG, C_LIGHT_BG)
  doc.rect(4, footerY, width - 8, 5.4, 'F')
  doc.setLineWidth(0.2)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4, footerY, width - 8, 5.4, 'S')

  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6)
  const footerMsg = isIntl
    ? 'INTL PARCEL • UNSTITCHED TEXTILE FABRIC'
    : 'UNSTITCHED TEXTILE FABRIC'
  doc.text(footerMsg, width / 2, footerY + 3.6, { align: 'center' })

  return doc
}

/**
 * Backward compatibility alias so existing imports continue to work
 */
export const generateA5ShippingLabelPDF = generateA7ShippingLabelPDF
