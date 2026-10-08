'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MessageCircle, Check, ArrowLeft, Shield, Truck, Scissors, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getWhatsAppLink, getProductInquiryMessage } from '@/lib/whatsapp'
import productsData from '@/data/products.json'
import { Product } from '@/types'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params?.id as string

  const [productsList, setProductsList] = useState<Product[]>(productsData as unknown as Product[])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setProductsList(data)
          }
        }
      } catch {
        // Fallback to imported json on network error
      } finally {
        setLoading(false)
      }
    }
    loadLiveProducts()
  }, [])

  const product = productsList.find(p => p.id === productId) || productsList[0]
  
  // Gallery Active Selection (5 total images: 2 Stitched Blouse renders + 3 Fabric Photos)
  const rawImages = product?.images && Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/images/logo.svg']
  const productImages = rawImages.map(img => (img || '').replace(/^stitched_front:/, '').replace(/^stitched_back:/, ''))
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Touch Swipe Gesture Handling for Mobile & Tablet
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  const minSwipeDistance = 40 // Minimum pixel drag to trigger swipe

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextImage()
    } else if (isRightSwipe) {
      handlePrevImage()
    }
  }

  const whatsappInquiryUrl = product ? getWhatsAppLink(getProductInquiryMessage(product)) : '#'

  // Find related products
  const relatedProducts = productsList
    .filter(p => product && p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const getImageLabel = (index: number) => {
    if (productImages.length >= 5) {
      if (index === 0) return 'Stitched Blouse (Front Render)'
      if (index === 1) return 'Stitched Blouse (Back Render)'
      if (index === 2) return 'Raw Fabric (Front Neck Photo)'
      if (index === 3) return 'Raw Fabric (Back Neck Photo)'
      if (index === 4) return 'Raw Fabric (Sleeve/Hand Photo)'
    }
    if (index === 0) return 'Front View'
    if (index === 1) return 'Back View'
    if (index === 2) return 'Front Fabric Photo'
    if (index === 3) return 'Back Fabric Photo'
    if (index === 4) return 'Sleeve/Hand Photo'
    return `Fabric Photo #${index + 1}`
  }

  const hex = product?.specifications?.hexColor || '#C4204F'
  const hasValidImages = product?.images && product.images.length > 0 && product.images[0] !== '/images/logo.svg'

  // Add state for Full Screen Zoom Modal
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)

  const getImageDescription = (index: number) => {
    if (productImages.length >= 5) {
      if (index === 0) return 'Front View Studio 3D Stitched Blouse render showing neckline closure, seam details, and symmetrical sleeve embroidery.'
      if (index === 1) return 'Back View Studio 3D Stitched Blouse render featuring keyhole/pot-neck cut, dori ties with latkan tassels, and sleeve borders.'
      if (index === 2) return 'Raw unstitched fabric closeup photo focusing on the Front Neckline embroidery work and material texture.'
      if (index === 3) return 'Raw unstitched fabric closeup photo focusing on the Back Neckline embroidery pattern and border details.'
      if (index === 4) return 'Raw unstitched fabric closeup photo focusing on the Sleeve/Hand embroidery motifs and fabric weave.'
    }
    if (index === 0) return 'Front view of the blouse fabric pattern.'
    if (index === 1) return 'Back view of the blouse fabric pattern.'
    if (index === 2) return 'Front neck unstitched fabric detail.'
    if (index === 3) return 'Back neck unstitched fabric detail.'
    if (index === 4) return 'Sleeve/Hand unstitched fabric detail.'
    return `Detailed view of fabric photo #${index + 1}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-10 md:py-16">
        <div className="container-custom">
          
          {/* Back to Products Link */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collections</span>
            </Link>
          </div>

          {/* Main Product Layout (Expanded 7 columns for Left Gallery for bigger image view) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Gallery Left Column - Expanded lg:col-span-7 with prominent display image & context bar */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Main Image Display Box - Height expanded with Touch Swipe Events */}
              <div
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="relative w-full min-h-[460px] md:min-h-[580px] bg-[#FAF8F5] rounded-3xl overflow-hidden border border-gray-200 shadow-md flex items-center justify-center p-6 group select-none touch-pan-y"
              >
                {hasValidImages ? (
                  <>
                    <img
                      src={productImages[activeImageIndex] || productImages[0]}
                      alt={`${product?.name || 'Blouse Fabric'} - ${getImageLabel(activeImageIndex)}`}
                      className="w-full h-full max-h-[640px] object-contain rounded-2xl cursor-pointer"
                      onClick={() => setIsZoomModalOpen(true)}
                    />
                    
                    {/* Image Label Overlay Badge */}
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-md border border-gray-100 flex items-center gap-2 z-10">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      <span>{getImageLabel(activeImageIndex)}</span>
                    </div>

                    {/* Mobile & Desktop Swipe Navigation Arrow Buttons */}
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePrevImage()
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200/80 transition-all hover:scale-110 active:scale-95 z-20"
                          title="Previous Image (Swipe Right)"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-900" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNextImage()
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200/80 transition-all hover:scale-110 active:scale-95 z-20"
                          title="Next Image (Swipe Left)"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-900" />
                        </button>
                      </>
                    )}

                    {/* Mobile Touch Swipe Indicator Dots */}
                    {productImages.length > 1 && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                        {productImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              activeImageIndex === idx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                            }`}
                            title={`Go to image #${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Expand / Full Screen Zoom Button */}
                    <button
                      onClick={() => setIsZoomModalOpen(true)}
                      className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-semibold text-gray-800 shadow-md hover:bg-primary hover:text-white transition-all hidden sm:flex items-center gap-1.5 z-10"
                      title="Click to Zoom Full Screen"
                    >
                      <span className="text-sm">🔍</span>
                      <span>Zoom</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <svg
                      className="w-52 h-52 drop-shadow-lg"
                      viewBox="0 0 24 24"
                      fill={hex}
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div className="text-center">
                      <p className="font-heading text-xl font-bold text-gray-800">{product?.name}</p>
                      <span className="inline-block px-4 py-1.5 mt-2 text-xs uppercase tracking-wider bg-primary/10 text-primary rounded-full font-accent font-bold">
                        {product?.specifications?.color} Swatch
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Image Detailed Context Explanation Box */}
              {hasValidImages && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl flex-shrink-0 mt-0.5">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-gray-900 mb-0.5">
                      Currently Viewing: {getImageLabel(activeImageIndex)}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {getImageDescription(activeImageIndex)}
                    </p>
                  </div>
                </div>
              )}

              {/* 5 Thumbnails Selector Bar (Slightly larger thumbnails) */}
              {hasValidImages && (
                <div className="grid grid-cols-5 gap-3 pt-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[1/1] rounded-2xl overflow-hidden border-2 transition-all p-1 bg-[#FAF8F5] ${
                        activeImageIndex === idx ? 'border-primary shadow-md scale-105 ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Specifications & Details Right Column (Adjusted to lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs uppercase tracking-wider font-accent text-secondary-dark bg-secondary/10 px-3 py-1 rounded-full font-semibold">
                    {product?.category}
                  </span>
                  <span className="text-xs text-gray-400">SKU: {product?.sku}</span>
                </div>

                <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  {product?.name}
                </h1>

                <div className="text-2xl font-bold font-accent text-primary mb-6">
                  {product?.priceDisplay}
                </div>

                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  {product?.description?.full}
                </p>

                {/* Direct WhatsApp Call to Action */}
                <div className="mb-8 p-6 rounded-2xl bg-[#FAF8F5] border border-gray-200/80">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Fabric Inquiry &amp; Availability</h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Have questions about saree color matching, custom meter cuts, or delivery timeframe? Inquire directly with Ragas Boutique on WhatsApp.
                  </p>
                  
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Specifications Grid */}
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Fabric Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs text-gray-400 uppercase">Material</span>
                      <span className="font-semibold text-gray-800">{product?.specifications?.fabric || 'Pure Silk'}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs text-gray-400 uppercase">Cut Length</span>
                      <span className="font-semibold text-gray-800">{product?.specifications?.cutLength || '1.0 Meter (Unstitched)'}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs text-gray-400 uppercase">Craft / Work</span>
                      <span className="font-semibold text-gray-800">{product?.specifications?.work || 'Zari Embroidery'}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs text-gray-400 uppercase">Care Instructions</span>
                      <span className="font-semibold text-gray-800">{product?.specifications?.care || 'Dry clean only'}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                {product?.features && (
                  <div className="mb-8">
                    <h3 className="font-heading text-base font-bold text-gray-900 mb-3">Key Highlights</h3>
                    <ul className="space-y-2">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Service Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <Scissors className="w-4 h-4 text-primary" />
                  <span>Unstitched Cut Piece</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Authentic Material</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Safe Delivery</span>
                </div>
              </div>

            </div>

          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-16">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
                Similar Designs You May Like
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {relatedProducts.map(rel => (
                  <Link key={rel.id} href={`/product/${rel.id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 p-4 hover:shadow-md transition-all">
                    <div className="aspect-[3/4] bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                      <p className="font-heading font-semibold text-gray-800 text-center">{rel.name}</p>
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{rel.name}</h3>
                    <span className="font-accent font-bold text-primary text-sm mt-1 block">{rel.priceDisplay}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Full-Screen High Resolution Image Zoom Modal */}
      {isZoomModalOpen && hasValidImages && (
        <div
          onClick={() => setIsZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn cursor-pointer"
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-colors text-xs uppercase font-bold flex items-center gap-1 z-50 cursor-pointer"
          >
            <span>Close (Esc)</span> ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center cursor-default"
          >
            <img
              src={productImages[activeImageIndex] || productImages[0]}
              alt={getImageLabel(activeImageIndex)}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            
            <div className="mt-4 text-center text-white space-y-1">
              <h3 className="font-heading text-lg font-bold">
                {product?.name || 'Blouse Fabric'} — {getImageLabel(activeImageIndex)}
              </h3>
              <p className="text-xs text-gray-300 max-w-2xl mx-auto">
                {getImageDescription(activeImageIndex)}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
