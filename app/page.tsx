'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Scissors, MessageCircle, Lock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'
import { Product } from '@/types'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const whatsappUrl = getWhatsAppLink(getGeneralInquiryMessage())

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setFeaturedProducts(data.filter(p => p.featured))
        }
      })
      .catch(err => console.error('Error fetching products:', err))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        
        {/* Hero Banner Section */}
        <section className="relative bg-[#FAF8F5] py-16 md:py-24 border-b border-gray-100 overflow-hidden">
          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Boutique Unstitched Blouse Fabric Catalog</span>
                </div>

                <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                  Exquisite Designer <span className="text-primary italic font-serif">Blouse Materials</span> &amp; Silk Cuts
                </h1>

                <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Discover premium unstitched blouse fabric materials at <strong>RAGAS BOUTIQUE</strong>. We offer high-quality <strong>Netted Tissue Fabric</strong>, <strong>Semi Silk Fabric</strong>, and <strong>Tissue Fabric</strong> cut pieces — ready for your custom tailoring.
                </p>

                {/* Price Range Banner */}
                <div className="inline-flex flex-wrap items-center gap-3 bg-white px-6 py-3.5 rounded-2xl border border-gray-200 shadow-sm text-sm text-gray-800">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-gray-600">Price Range:</span>
                  <span className="text-primary font-accent text-xl md:text-2xl font-extrabold tracking-tight">₹400 – ₹4,000</span>
                  <span className="text-xs text-gray-400 font-normal uppercase tracking-wider pl-3 border-l border-gray-200 hidden sm:inline font-bold">Same Day Dispatch</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/products" className="btn-primary px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-center">
                    Explore Collections
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/80 text-center lg:text-left text-xs text-gray-500">
                  <div>
                    <span className="block font-bold text-gray-900 text-lg md:text-xl font-accent text-primary">₹400 – ₹4,000</span>
                    Affordable Pricing
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-base md:text-lg">1.0m – 1.2m</span>
                    Unstitched Cut
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-base md:text-lg">⚡ Express</span>
                    Same Day Dispatch
                  </div>
                </div>
              </div>

              {/* RAGAS BOUTIQUE Official Brand Emblem Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative aspect-[4/5] w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-200 flex flex-col justify-between items-center text-center">
                  
                  <div className="w-full flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">Official Store</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      In Stock
                    </span>
                  </div>

                  {/* Boutique Brand Logo Display */}
                  <div className="w-full my-6 flex flex-col items-center justify-center p-6 bg-[#FAF8F5] rounded-2xl border border-gray-100 space-y-4">
                    <div className="relative w-44 h-28">
                      <Image 
                        src="/images/logo.svg" 
                        alt="Ragas Boutique Logo" 
                        fill 
                        className="object-contain"
                        priority
                        unoptimized
                      />
                    </div>
                    <div className="w-12 h-0.5 bg-primary/30 rounded-full" />
                    <p className="text-xs text-gray-600 font-medium">Washermenpet, Chennai - 600021</p>
                  </div>

                  <div className="w-full space-y-2 pt-2 border-t border-gray-100">
                    <h3 className="font-heading text-lg font-extrabold text-gray-900">RAGAS BOUTIQUE CHENNAI</h3>
                    <p className="text-xs text-gray-500">Unstitched Blouse Fabrics • Netted Tissue, Semi Silk &amp; Pure Tissue Cuts</p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <span className="text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/20">₹400 – ₹4,000 Range</span>
                      <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">1.0m+ Unstitched</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Collections Showcase - 3 Primary Fabric Categories */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="section-header">
              <h2 className="section-title">Explore Our Signature Fabric Categories</h2>
              <p className="section-subtitle">Discover unstitched blouse materials categorized by fabric type &amp; weave (Price ₹400 – ₹4,000).</p>
              <div className="divider" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <Link href="/products?fabric=Netted Tissue Fabric" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4] bg-gray-900 flex flex-col justify-end p-6 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="relative z-20 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-accent text-amber-400 font-bold">Fabric Category 1</span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-1">Netted Tissue Fabric</h3>
                  <p className="text-xs text-gray-300 mt-2 opacity-90">Lightweight netted sheer texture with shimmering metallic borders.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-light uppercase tracking-wider mt-4 group-hover:underline">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>

              <Link href="/products?fabric=Semi silk fabric" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4] bg-gray-900 flex flex-col justify-end p-6 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="relative z-20 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-accent text-amber-400 font-bold">Fabric Category 2</span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-1">Semi Silk Fabric</h3>
                  <p className="text-xs text-gray-300 mt-2 opacity-90">Lustrous semi silk texture with soft feel &amp; traditional zari finish.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-light uppercase tracking-wider mt-4 group-hover:underline">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>

              <Link href="/products?fabric=Tissue fabric" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/4] bg-gray-900 flex flex-col justify-end p-6 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="relative z-20 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-accent text-amber-400 font-bold">Fabric Category 3</span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-1">Tissue Fabric</h3>
                  <p className="text-xs text-gray-300 mt-2 opacity-90">Ultra-rich metallic sheen fabric suitable for heavy designer blouses.</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-light uppercase tracking-wider mt-4 group-hover:underline">
                    Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-[#FAF8F5]">
          <div className="container-custom">
            <div className="section-header">
              <h2 className="section-title">Featured Fabrics</h2>
              <p className="section-subtitle">Our most popular unstitched blouse materials</p>
              <div className="divider" />
            </div>

            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 p-8 max-w-lg mx-auto">
                <p className="text-sm text-gray-600">New handcrafted blouse collections coming soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => {
                  const hex = product.specifications?.hexColor || '#C4204F'
                  const hasValidImages = product.images && product.images.length > 0 && product.images[0] !== '/images/logo.svg'
                  
                  let previewImageUrl: string | null = null
                  if (hasValidImages) {
                    if (product.images.length >= 5) {
                      previewImageUrl = product.images[1] // Super Admin AI Back Neck Render
                    } else if (product.images.length >= 2) {
                      previewImageUrl = product.images[1] // Admin Back Neck Fabric Photo
                    } else {
                      previewImageUrl = product.images[0]
                    }
                  }

                  return (
                    <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative aspect-[3/4] bg-[#FAF8F5] flex items-center justify-center p-6 border-b border-gray-100">
                          {previewImageUrl ? (
                            <img
                              src={previewImageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-3 py-6">
                              <svg
                                className="w-28 h-28 drop-shadow-md transition-transform duration-300 hover:scale-110"
                                viewBox="0 0 24 24"
                                fill={hex}
                                stroke="#FFFFFF"
                                strokeWidth="0.8"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <div className="text-center">
                                <p className="font-heading text-base font-bold text-gray-800">{product.name}</p>
                                <span className="inline-block px-3 py-0.5 mt-1 text-[10px] uppercase tracking-wider bg-primary/10 text-primary rounded-full font-accent font-semibold">
                                  {product.specifications?.color}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description.short}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="font-accent font-bold text-primary text-lg">{product.priceDisplay}</span>
                          <a
                            href={getWhatsAppLink(`Hi! I'm interested in ${product.name} (SKU: ${product.sku}).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp text-xs px-3 py-2 rounded-md font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Inquire</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/products" className="btn-outline px-8 py-3 rounded-full uppercase tracking-wider text-xs font-semibold inline-flex items-center gap-2">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Generous Fabric Cut</h3>
                <p className="text-sm text-gray-600">Standard 1-meter to 1.2-meter unstitched cuts providing ample material for any sleeve &amp; neck design.</p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Guaranteed Quality</h3>
                <p className="text-sm text-gray-600">Handpicked Netted Tissue, Semi Silk &amp; Tissue fabrics carefully curated for boutique quality.</p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">Direct WhatsApp Service</h3>
                <p className="text-sm text-gray-600">Personalized saree matching assistance and instant stock confirmation directly on WhatsApp.</p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
