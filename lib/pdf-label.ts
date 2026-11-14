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

  // --- HEADER BANNER (Compact Slim Height: 6.8mm) ---
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, 3.5, width - 7, 6.8, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('RAGAS BOUTIQUE', width / 2, 7.3, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(4.2)
  const headerSubtitle = isIntl
    ? 'INTERNATIONAL PRIORITY PARCEL LABEL'
    : 'PRIORITY PARCEL SHIPPING LABEL'
  doc.text(headerSubtitle, width / 2, 9.6, { align: 'center' })

  // --- RECIPIENT / DELIVER TO BOX (Top Half) ---
  // Generous equal box height: 41.5mm each
  const toBoxY = 11.2
  const boxHeight = 41.5
  doc.setFillColor(C_LIGHT_BG, C_LIGHT_BG, C_LIGHT_BG)
  doc.rect(3.5, toBoxY, width - 7, boxHeight, 'F')
  doc.setLineWidth(0.4)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, toBoxY, width - 7, boxHeight, 'S')

  // "DELIVER TO" Title Tab
  const badgeWidth = isIntl ? 36 : 28
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, toBoxY, badgeWidth, 5.2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text(isIntl ? 'DELIVER TO (INTL):' : 'DELIVER TO:', 5.5, toBoxY + 3.8)

  // Customer Name
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  const safeName = (data.customerName || 'VALUED CUSTOMER').trim().toUpperCase()
  const nameLines = doc.splitTextToSize(safeName, width - 11)
  doc.text(nameLines[0] || safeName, 5.5, toBoxY + 9.2)

  // Phone Number Line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.8)
  doc.setTextColor(C_DARK, C_DARK, C_DARK)
  const altText = data.alternatePhone ? ` / ${data.alternatePhone}` : ''
  const phoneStr = `PH: ${codePrefix} ${data.phoneNumber}${altText}`
  const phoneLines = doc.splitTextToSize(phoneStr, width - 11)
  doc.text(phoneLines[0] || phoneStr, 5.5, toBoxY + 13.2)

  // Address Lines:
  // Line 1: House No. / Flat / Building Name & Street Name
  // Line 2: Locality / District / Landmark
  // Line 3: City / Town, State
  // Auto-fit loop: if there are many lines, automatically adjust font size down
  // so the entire address comfortably fits without overlapping the bottom badge
  const streetLine = (data.doorNoStreet || '').trim()
  const localityLine = (data.localityLandmark || '').trim()
  const cityStateLine = `${(data.city || '').trim()}${data.state ? `, ${(data.state || '').trim()}` : ''}`

  const startAddrY = toBoxY + 16.8
  const maxAvailableHeight = (toBoxY + boxHeight - 9.0) - startAddrY // ~15.7mm available space

  let addrFontSize = 8.5
  let lineHeight = addrFontSize * 0.42
  let sLines: string[] = []
  let lLines: string[] = []
  let cLines: string[] = []

  // Try font sizes from 8.5 down to 5.5 to guarantee all lines fit inside available height
  while (addrFontSize >= 5.5) {
    doc.setFontSize(addrFontSize)
    lineHeight = addrFontSize * 0.40
    sLines = streetLine ? doc.splitTextToSize(streetLine, width - 11) : []
    lLines = localityLine ? doc.splitTextToSize(localityLine, width - 11) : []
    cLines = cityStateLine ? doc.splitTextToSize(cityStateLine, width - 11) : []

    const totalHeight = (sLines.length + lLines.length + cLines.length) * lineHeight
    if (totalHeight <= maxAvailableHeight || addrFontSize <= 5.5) {
      break
    }
    addrFontSize -= 0.5
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(addrFontSize)
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)

  let currentAddrY = startAddrY
  if (sLines.length > 0) {
    doc.text(sLines, 5.5, currentAddrY)
    currentAddrY += sLines.length * lineHeight
  }

  if (lLines.length > 0) {
    doc.text(lLines, 5.5, currentAddrY)
    currentAddrY += lLines.length * lineHeight
  }

  if (cLines.length > 0) {
    doc.text(cLines, 5.5, currentAddrY)
  }

  // High-Contrast Postal / Destination Badge inside TO Box
  const codeBoxY = toBoxY + boxHeight - 8.5
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4.5, codeBoxY, width - 9, 7.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  const zipText = isIntl ? `POSTAL: ${data.pincode}` : `PINCODE: ${data.pincode}`
  doc.text(zipText, 6.5, codeBoxY + 3.8)

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.text(`DEST: ${countryName}`, 6.5, codeBoxY + 6.6)

  // --- SENDER / FROM ADDRESS SECTION (Bottom Half - Equally Sized 41.5mm) ---
  const fromBoxY = toBoxY + boxHeight + 1.5 // 54.2
  doc.setFillColor(255, 255, 255)
  doc.rect(3.5, fromBoxY, width - 7, boxHeight, 'F')
  doc.setLineWidth(0.4)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, fromBoxY, width - 7, boxHeight, 'S')

  // "FROM / SENDER" Title Tab
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, fromBoxY, 26, 5.2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text('FROM / SENDER:', 5.5, fromBoxY + 3.8)

  // Sender Boutique Name
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10.5)
  doc.text(BOUTIQUE_ADDRESS.name, 5.5, fromBoxY + 9.5)

  // Sender Phone Number Line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.2)
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.text(`Phone / WhatsApp: ${BOUTIQUE_ADDRESS.phone}`, 5.5, fromBoxY + 14)

  // Separate Sender Address Lines with matching enlarged font size (9pt):
  // Line 1: Street / Building
  // Line 2: Locality / Area
  // Line 3: City, State - Pincode, Country
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.text(BOUTIQUE_ADDRESS.line1, 5.5, fromBoxY + 18.5)
  doc.text(BOUTIQUE_ADDRESS.line2, 5.5, fromBoxY + 22.5)
  doc.text(BOUTIQUE_ADDRESS.cityStatePincode, 5.5, fromBoxY + 26.5)

  // Sender Origin Badge (Matching design with TO destination badge)
  const fromCodeBoxY = fromBoxY + boxHeight - 8.5
  doc.setFillColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(4.5, fromCodeBoxY, width - 9, 7.5, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('PINCODE: 600021', 6.5, fromCodeBoxY + 3.8)

  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.text('ORIGIN: CHENNAI, TAMIL NADU (INDIA)', 6.5, fromCodeBoxY + 6.6)

  // --- FOOTER STRIP ---
  const footerY = fromBoxY + boxHeight + 1.2 // 96.9
  doc.setFillColor(C_LIGHT_BG, C_LIGHT_BG, C_LIGHT_BG)
  doc.rect(3.5, footerY, width - 7, 4.6, 'F')
  doc.setLineWidth(0.2)
  doc.setDrawColor(C_BLACK, C_BLACK, C_BLACK)
  doc.rect(3.5, footerY, width - 7, 4.6, 'S')

  doc.setTextColor(C_BLACK, C_BLACK, C_BLACK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(5.8)
  const footerMsg = isIntl
    ? 'INTL PARCEL • UNSTITCHED TEXTILE FABRIC'
    : 'UNSTITCHED TEXTILE FABRIC'
  doc.text(footerMsg, width / 2, footerY + 3.2, { align: 'center' })

  return doc
}

/**
 * Backward compatibility alias so existing imports continue to work
 */
export const generateA5ShippingLabelPDF = generateA7ShippingLabelPDF
