'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MapPin, User, Building, Send, Download, CheckCircle2, Sparkles, Globe, Plane } from 'lucide-react'
import { generateA5ShippingLabelPDF, ShippingAddressData, BOUTIQUE_ADDRESS } from '@/lib/pdf-label'
import { getWhatsAppLink } from '@/lib/whatsapp'

const INDIAN_STATES = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
  'Telangana',
  'Maharashtra',
  'Puducherry',
  'Gujarat',
  'Delhi',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'Punjab',
  'Haryana',
  'Assam',
  'Odisha',
  'Other State / Union Territory'
]

const POPULAR_COUNTRIES = [
  { name: 'United States', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'Singapore', code: '+65' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Australia', code: '+61' },
  { name: 'Canada', code: '+1' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'Qatar', code: '+974' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Oman', code: '+968' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Other Country', code: '+' }
]

export default function ShippingAddressPage() {
  const [addressType, setAddressType] = useState<'domestic' | 'international'>('domestic')

  // Shared / Domestic Fields
  const [customerName, setCustomerName] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [alternatePhone, setAlternatePhone] = useState('')
  const [doorNoStreet, setDoorNoStreet] = useState('')
  const [localityLandmark, setLocalityLandmark] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Tamil Nadu')
  const [pincode, setPincode] = useState('')
  
  // International-specific Fields
  const [selectedCountry, setSelectedCountry] = useState('United States')
  const [customCountryName, setCustomCountryName] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [postalZipCode, setPostalZipCode] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const isIntl = addressType === 'international'

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isIntl) {
      const val = e.target.value.replace(/\D/g, '').slice(0, 6)
      setPincode(val)
    } else {
      setPostalZipCode(e.target.value)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isIntl) {
      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
      setPhoneNumber(val)
    } else {
      setPhoneNumber(e.target.value)
    }
  }

  const getFinalCountryName = (): string => {
    if (!isIntl) return 'India'
    return selectedCountry === 'Other Country' ? customCountryName || 'International' : selectedCountry
  }

  const getFormData = (): ShippingAddressData => ({
    customerName,
    countryCode: isIntl ? countryCode : '+91',
    phoneNumber,
    alternatePhone,
    doorNoStreet,
    localityLandmark,
    city,
    state: isIntl ? stateProvince : state,
    pincode: isIntl ? postalZipCode : pincode,
    country: getFinalCountryName(),
    isInternational: isIntl,
  })

  const handleDownloadPDF = () => {
    if (!customerName || !phoneNumber || !doorNoStreet || !city) {
      alert('Please fill in all required address fields.')
      return
    }
    const doc = generateA5ShippingLabelPDF(getFormData())
    const codeVal = isIntl ? postalZipCode : pincode
    const filename = `Ragas-Shipping-Label-${customerName.replace(/[^a-zA-Z0-9]/g, '-')}-${codeVal || 'intl'}.pdf`
    doc.save(filename)
  }

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isIntl && pincode.length !== 6) {
      alert('Please enter a valid 6-digit Indian Pincode.')
      return
    }

    if (!isIntl && phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit Indian Mobile Number.')
      return
    }

    if (isIntl && (!postalZipCode || !selectedCountry)) {
      alert('Please enter your Postal Code / Zipcode and Country.')
      return
    }

    setIsGenerating(true)

    // Automatically trigger PDF download for customer
    const doc = generateA5ShippingLabelPDF(getFormData())
    const codeVal = isIntl ? postalZipCode : pincode
    const filename = `Ragas-Shipping-Label-${customerName.replace(/[^a-zA-Z0-9]/g, '-')}-${codeVal || 'intl'}.pdf`
    doc.save(filename)

    // Create PDF blob for potential direct Web Share API file attachment
    const pdfBlob = doc.output('blob')
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' })

    // Construct formatted text summary for WhatsApp Business
    const whatsappText = `📦 *NEW ${isIntl ? 'INTERNATIONAL' : 'DOMESTIC'} SHIPPING ADDRESS* - RAGAS BOUTIQUE

👤 *CUSTOMER NAME:* ${customerName.trim()}
📞 *PHONE:* ${isIntl ? countryCode : '+91'} ${phoneNumber}${alternatePhone ? ` (Alt: ${alternatePhone})` : ''}

🏠 *DELIVERY ADDRESS:*
${doorNoStreet.trim()}
${localityLandmark ? `Landmark: ${localityLandmark.trim()}` : ''}
${city.trim()}, ${isIntl ? stateProvince.trim() : state}
📌 *${isIntl ? 'POSTAL / ZIP CODE' : 'PINCODE'}:* ${codeVal}
🌍 *COUNTRY:* ${getFinalCountryName()}

---
📄 *Parcel Shipping Label PDF generated & downloaded to your phone.*
✈️ *${isIntl ? 'International Shipping Request' : 'Same Day Dispatch Request'}*`

    const waLink = getWhatsAppLink(whatsappText)
    
    setTimeout(async () => {
      setIsGenerating(false)
      setSubmitted(true)

      // Check if browser supports direct file sharing via Web Share API (Mobile Chrome / Safari)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            title: `Ragas Boutique Shipping Label - ${customerName}`,
            text: whatsappText,
            files: [pdfFile]
          })
          return
        } catch {
          // Fallback to standard WhatsApp deep link if user cancels share dialog
        }
      }

      window.open(waLink, '_blank')
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 md:py-16 px-4">
        <div className="container-custom max-w-3xl">
          
          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Ragas Boutique Parcel Shipping</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900">
              Delivery Address Form
            </h1>
            <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
              Please enter your full delivery address (Indian or International). Once submitted, an <strong>A5 Printable Parcel Shipping Label PDF</strong> will be created and shared directly with the shop via WhatsApp for dispatch.
            </p>
          </div>

          {/* Address Type Switcher Tab */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => {
                setAddressType('domestic')
                setCountryCode('+91')
              }}
              className={`px-6 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                addressType === 'domestic'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>🇮🇳 Indian Address (Domestic)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAddressType('international')
                setCountryCode('+1')
              }}
              className={`px-6 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                addressType === 'international'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Globe className="w-4 h-4 text-purple-300" />
              <span>✈️ International Address (Global)</span>
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            
            {submitted ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">Address &amp; PDF Ready!</h2>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    Your {isIntl ? 'international' : 'domestic'} delivery details and A5 parcel shipping label PDF have been generated.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold space-y-2 max-w-lg mx-auto text-left">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                    <Download className="w-4 h-4 text-amber-700" />
                    <span>How to send the PDF file in WhatsApp:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-gray-800 pt-1 font-normal">
                    <li>The A5 Label PDF file has been downloaded to your phone/computer.</li>
                    <li>In WhatsApp, tap the <strong>📎 Attachment (Paperclip / +) icon</strong> in the chat with Ragas Boutique.</li>
                    <li>Select <strong>Document</strong> and choose the downloaded <strong>Ragas-Shipping-Label-*.pdf</strong> file.</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={handleDownloadPDF}
                    className="btn-outline px-6 py-3 rounded-2xl text-xs font-bold uppercase flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download A5 Label PDF</span>
                  </button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary px-6 py-3 rounded-2xl text-xs font-bold uppercase"
                  >
                    Submit Another Address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendToWhatsApp} className="space-y-6">
                
                {/* Section 1: Customer Contact Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>1. Customer Contact Details {isIntl && '(International Shipping)'}</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sundaram"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                          Phone Number {isIntl && '(with Country Code)'} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {isIntl ? (
                            <input
                              type="text"
                              placeholder="+1"
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-20 px-3 py-3 rounded-xl border border-gray-200 text-sm text-center font-mono font-bold text-purple-900 bg-purple-50/40"
                            />
                          ) : (
                            <span className="px-3.5 py-3 rounded-xl border border-gray-200 text-sm font-mono font-bold text-gray-700 bg-gray-50">+91</span>
                          )}
                          <input
                            type="tel"
                            required
                            placeholder={isIntl ? 'Mobile / WhatsApp number' : '10-digit mobile number'}
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                          Alternate Phone <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Alternate contact number"
                          value={alternatePhone}
                          onChange={(e) => setAlternatePhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Address Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    {isIntl ? <Globe className="w-4 h-4 text-purple-600" /> : <MapPin className="w-4 h-4" />}
                    <span>2. {isIntl ? 'International Destination Address' : 'Domestic Delivery Address'}</span>
                  </h3>

                  <div className="space-y-4">
                    {isIntl && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 mb-2">
                        <div>
                          <label className="block text-xs font-bold text-purple-900 uppercase mb-1.5">
                            Destination Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedCountry}
                            onChange={(e) => {
                              const cName = e.target.value
                              setSelectedCountry(cName)
                              const match = POPULAR_COUNTRIES.find(c => c.name === cName)
                              if (match && match.code !== '+') {
                                setCountryCode(match.code)
                              }
                            }}
                            className="w-full px-3 py-3 rounded-xl border border-purple-200 text-sm bg-white font-bold text-purple-900 focus:ring-2 focus:ring-purple-200"
                          >
                            {POPULAR_COUNTRIES.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        {selectedCountry === 'Other Country' && (
                          <div>
                            <label className="block text-xs font-bold text-purple-900 uppercase mb-1.5">
                              Specify Country Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Enter country name"
                              value={customCountryName}
                              onChange={(e) => setCustomCountryName(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-purple-200 text-sm bg-white focus:ring-2 focus:ring-purple-200"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                        {isIntl ? 'Street Address / Suite / Apartment No.' : 'House No. / Flat / Building Name & Street Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isIntl ? 'e.g. 742 Evergreen Terrace, Apt 4B' : 'e.g. Door No. 42, Green Park 2nd Street'}
                        value={doorNoStreet}
                        onChange={(e) => setDoorNoStreet(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                        Locality / District / Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Central Park / District / County"
                        value={localityLandmark}
                        onChange={(e) => setLocalityLandmark(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                          City / Town <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isIntl ? 'e.g. New York / London' : 'e.g. Chennai'}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                          {isIntl ? 'State / Province / Region' : 'State'} <span className="text-red-500">*</span>
                        </label>
                        {isIntl ? (
                          <input
                            type="text"
                            required
                            placeholder="e.g. California / Ontario"
                            value={stateProvince}
                            onChange={(e) => setStateProvince(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        ) : (
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                          {isIntl ? 'Postal Code / Zipcode' : 'Pincode'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isIntl ? 'Zipcode / Postcode' : '6-digit Pincode'}
                          value={isIntl ? postalZipCode : pincode}
                          onChange={handlePincodeChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono font-bold tracking-wider"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Boutique Dispatch Address Box Preview */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 uppercase">
                    <Building className="w-4 h-4 text-amber-700" />
                    <span>Sender Address (Printed on Parcel Label):</span>
                  </div>
                  <p className="font-bold text-gray-900">{BOUTIQUE_ADDRESS.name}</p>
                  <p>{BOUTIQUE_ADDRESS.line1}, {BOUTIQUE_ADDRESS.line2}</p>
                  <p>{BOUTIQUE_ADDRESS.cityStatePincode}, {BOUTIQUE_ADDRESS.country} • Phone: {BOUTIQUE_ADDRESS.phone}</p>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-white ${
                      isIntl ? 'bg-purple-700 hover:bg-purple-800' : 'btn-primary'
                    }`}
                  >
                    {isIntl ? <Plane className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    <span>{isGenerating ? 'Generating A5 Label PDF...' : `Send ${isIntl ? 'International' : 'Domestic'} Address to Shop via WhatsApp`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                    <span>Preview / Download A5 Parcel Label PDF</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
