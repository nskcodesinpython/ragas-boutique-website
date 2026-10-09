'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Filter, SlidersHorizontal, MessageCircle, X, Palette, RefreshCw, LayoutGrid, List, Star, Truck, CheckCircle2, ShieldCheck, Camera, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SareeImageColorPicker } from '@/components/SareeImageColorPicker'
import { getWhatsAppLink, getProductInquiryMessage } from '@/lib/whatsapp'
import { sortByClosestColor } from '@/lib/colors'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Layout View Mode state ('grid' | 'list')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Hovered image index per product map for preview strip
  const [hoveredImageIndices, setHoveredImageIndices] = useState<Record<string, number>>({})

  // Mobile Touch Swipe Trackers
  const [touchStartMap, setTouchStartMap] = useState<Record<string, number>>({})

  // Image Upload Color Picker Modal State
  const [showImagePickerModal, setShowImagePickerModal] = useState<boolean>(false)

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFabric, setSelectedFabric] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Interactive Color Picker Matching State
  const [targetColorHex, setTargetColorHex] = useState<string>('')
  const [enableColorMatching, setEnableColorMatching] = useState<boolean>(false)

  // Pagination & Tag Filter States
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedTag, setSelectedTag] = useState<string>('all') // 'all' | 'bestseller' | 'new'
  const ITEMS_PER_PAGE = 20

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedFabric, selectedPriceRange, selectedTag, searchQuery, targetColorHex, enableColorMatching])

  // Price Range Options
  const priceRanges = [
    { label: 'All Prices (₹400 - ₹4,000)', value: 'all' },
    { label: 'Under ₹500', value: 'under-500' },
    { label: '₹500 - ₹1,000', value: '500-1000' },
    { label: '₹1,000 - ₹1,500', value: '1000-1500' },
    { label: '₹1,500 - ₹2,000', value: '1500-2000' },
    { label: '₹2,000 - ₹2,500', value: '2000-2500' },
    { label: '₹2,500 - ₹3,000', value: '2500-3000' },
    { label: '₹3,000 - ₹3,500', value: '3000-3500' },
    { label: '₹3,500 - ₹4,000', value: '3500-4000' }
  ]

  // Dynamic API Fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch catalog', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Bridal', 'Semi Bridal', 'Casual']
  
  // 3 Primary Fabric Material Categories
  const fabrics = ['all', 'Netted Tissue Fabric', 'Semi Silk Fabric', 'Tissue Fabric']

  // Filter & Color Matching Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchCategory = selectedCategory === 'all' || (product.category || '').toLowerCase() === selectedCategory.toLowerCase()
      
      // Fabric matching
      const prodFab = (product.specifications?.fabric || '').toLowerCase()
      const matchFabric = selectedFabric === 'all' || 
        prodFab.includes(selectedFabric.toLowerCase()) ||
        (selectedFabric === 'Netted Tissue Fabric' && prodFab.includes('netted')) ||
        (selectedFabric === 'Semi Silk Fabric' && (prodFab.includes('silk') || prodFab.includes('semi'))) ||
        (selectedFabric === 'Tissue Fabric' && prodFab.includes('tissue'))

      // Tag & Collection filter (bestseller / new)
      let matchTag = true
      if (selectedTag === 'bestseller') matchTag = !!product.isBestseller
      else if (selectedTag === 'new') matchTag = !!product.isNewCollection

      // Price Range matching
      const p = product.price || 0
      let matchPrice = true
      if (selectedPriceRange === 'under-500') matchPrice = p < 500
      else if (selectedPriceRange === '500-1000') matchPrice = p >= 500 && p <= 1000
      else if (selectedPriceRange === '1000-1500') matchPrice = p > 1000 && p <= 1500
      else if (selectedPriceRange === '1500-2000') matchPrice = p > 1500 && p <= 2000
      else if (selectedPriceRange === '2000-2500') matchPrice = p > 2000 && p <= 2500
      else if (selectedPriceRange === '2500-3000') matchPrice = p > 2500 && p <= 3000
      else if (selectedPriceRange === '3000-3500') matchPrice = p > 3000 && p <= 3500
      else if (selectedPriceRange === '3500-4000') matchPrice = p > 3500 && p <= 4000

      const q = searchQuery.toLowerCase().trim()
      const matchSearch = q === '' || 
        product.name.toLowerCase().includes(q) ||
        (product.specifications?.color || '').toLowerCase().includes(q) ||
        product.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        (q.includes('bestseller') && product.isBestseller) ||
        (q.includes('new') && product.isNewCollection)

      return matchCategory && matchFabric && matchTag && matchPrice && matchSearch
    })

    // Sort by CIE76 closest color distance if picker active
    if (enableColorMatching && targetColorHex) {
      result = sortByClosestColor(result, targetColorHex)
    }

    return result
  }, [products, selectedCategory, selectedFabric, selectedTag, selectedPriceRange, searchQuery, enableColorMatching, targetColorHex])

  // Calculate 20 items per page slice
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedFabric('all')
    setSelectedPriceRange('all')
    setSelectedTag('all')
    setSearchQuery('')
    setTargetColorHex('')
    setEnableColorMatching(false)
    setCurrentPage(1)
  }

  // Handle Mobile Touch Swiping left/right on Product Cards
  const handleTouchStart = (productId: string, clientX: number) => {
    setTouchStartMap(prev => ({ ...prev, [productId]: clientX }))
  }

  const handleTouchEnd = (product: Product, clientX: number) => {
    const startX = touchStartMap[product.id]
    if (!startX || !product.images || product.images.length <= 1) return

    const diff = startX - clientX
    const currentIdx = hoveredImageIndices[product.id] ?? ((product.images.length >= 2) ? 1 : 0)

    if (diff > 40) {
      // Swiped Left -> Next Image
      const nextIdx = (currentIdx + 1) % product.images.length
      setHoveredImageIndices(prev => ({ ...prev, [product.id]: nextIdx }))
    } else if (diff < -40) {
      // Swiped Right -> Prev Image
      const prevIdx = (currentIdx - 1 + product.images.length) % product.images.length
      setHoveredImageIndices(prev => ({ ...prev, [product.id]: prevIdx }))
    }
  }

  // Helper to get clean display URL without internal tag prefixes
  const getCleanImageUrl = (url: string | null | undefined): string => {
    if (!url) return ''
    return url.replace(/^stitched_front:/, '').replace(/^stitched_back:/, '')
  }

  // Get active image index for product considering display rules & thumbnail hover
  const getActiveImage = (product: Product): string | null => {
    const hasValidImages = product.images && product.images.length > 0 && product.images[0] !== '/images/logo.svg'
    if (!hasValidImages) return null

    if (hoveredImageIndices[product.id] !== undefined) {
      const idx = hoveredImageIndices[product.id]
      if (product.images[idx]) return getCleanImageUrl(product.images[idx])
    }

    // Default to the first available image (Stitched render if present, else raw fabric photo)
    return getCleanImageUrl(product.images[0])
  }

  // Mobile Filter Drawer Open State
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  // Count active filters for badge counter
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedFabric !== 'all') count++
    if (selectedPriceRange !== 'all') count++
    if (selectedTag !== 'all') count++
    if (enableColorMatching) count++
    return count
  }, [selectedCategory, selectedFabric, selectedPriceRange, selectedTag, enableColorMatching])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-6 md:py-16">
        <div className="container-custom">
          
          {/* Title & View Toggle Area */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-1 sm:mb-2">
                Designer Blouse Fabrics Catalog
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                Explore unstitched Kanjeevaram silk, Banarasi brocade, Organza tissue, and Zardozi materials (₹400 – ₹4,000).
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Drawer Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4" />
                <span>Filter Catalog</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white text-primary text-[10px] rounded-full flex items-center justify-center font-extrabold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Layout Toggle Buttons */}
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary shadow-sm font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid View</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Detailed Catalog List View"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Detailed View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Color Match Banner & Saree Photo Upload */}
          <div className="bg-[#FAF8F5] p-6 md:p-8 rounded-3xl border border-gray-200/80 mb-10 space-y-6">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              {/* Color Picker & Saree Photo Camera Button */}
              <div className="w-full lg:w-auto flex-grow bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>Saree Color Matcher</span>
                    </h3>
                    <p className="text-xs text-gray-500">Pick color or upload saree photo to sort blouses by closest match</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Upload Saree Image Eyedropper Button */}
                  <button
                    onClick={() => setShowImagePickerModal(true)}
                    className="btn-primary text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Saree Photo</span>
                  </button>

                  <div className="relative flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-xl bg-gray-50">
                    <input
                      type="color"
                      value={targetColorHex || '#C4204F'}
                      onChange={(e) => {
                        setTargetColorHex(e.target.value)
                        setEnableColorMatching(true)
                      }}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold uppercase text-gray-800">
                      {targetColorHex || 'Pick Color'}
                    </span>
                  </div>

                  {enableColorMatching && (
                    <button
                      onClick={() => setEnableColorMatching(false)}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Clear Match
                    </button>
                  )}
                </div>
              </div>

              {/* Text Search */}
              <div className="w-full lg:w-80">
                <input
                  type="text"
                  placeholder="Search fabric name, silk, or color..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                />
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 text-xs text-gray-500">
              <span>
                Showing <strong className="text-gray-900">{filteredAndSortedProducts.length}</strong> blouse fabrics
              </span>
              {enableColorMatching && (
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Sorted Most Matching to Least Matching Color
                </span>
              )}
            </div>

          </div>

          {/* Saree Photo Color Picker Modal */}
          {showImagePickerModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
              <SareeImageColorPicker
                onSelectColor={(hex) => {
                  setTargetColorHex(hex)
                  setEnableColorMatching(true)
                  setShowImagePickerModal(false)
                }}
                onClose={() => setShowImagePickerModal(false)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-6 border-r border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>Filter Catalog</span>
                </h3>
                {(selectedCategory !== 'all' || selectedFabric !== 'all' || selectedPriceRange !== 'all' || searchQuery !== '' || enableColorMatching) && (
                  <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
                    Reset All
                  </button>
                )}
              </div>

              {/* Special Collections / Badges Filter */}
              <div>
                <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Special Collections
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedTag('all')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                      selectedTag === 'all'
                        ? 'bg-primary text-white font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Collections
                  </button>
                  <button
                    onClick={() => setSelectedTag(prev => prev === 'bestseller' ? 'all' : 'bestseller')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                      selectedTag === 'bestseller'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <span>🔥 Bestseller Fabrics</span>
                  </button>
                  <button
                    onClick={() => setSelectedTag(prev => prev === 'new' ? 'all' : 'new')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                      selectedTag === 'new'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    <span>✨ New Arrivals</span>
                  </button>
                </div>
              </div>

              {/* Price Range Filter Categories (Under 500 to 3500-4000) */}
              <div>
                <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Price Category (₹400 – ₹4,000)
                </h4>
                <div className="space-y-1">
                  {priceRanges.map(pr => (
                    <button
                      key={pr.value}
                      onClick={() => setSelectedPriceRange(pr.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        selectedPriceRange === pr.value
                          ? 'bg-primary text-white font-bold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <span>{pr.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Fabric Material Categories */}
              <div>
                <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Fabric Material Type
                </h4>
                <div className="space-y-1.5">
                  {fabrics.map(fab => (
                    <button
                      key={fab}
                      onClick={() => setSelectedFabric(fab)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm capitalize transition-colors ${
                        selectedFabric === fab
                          ? 'bg-primary text-white font-semibold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {fab === 'all' ? 'All Fabric Types' : fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saree Style Category Filter */}
              <div>
                <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Saree Style Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm capitalize transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary text-white font-semibold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Mobile Filter Drawer Slide-over Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white">
                {/* Drawer Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#FAF8F5]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-lg font-bold text-gray-900">Filter Catalog</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Reset All
                      </button>
                    )}
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-200/60"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  
                  {/* Special Collections / Badges Filter */}
                  <div>
                    <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Special Collections
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => { setSelectedTag('all'); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                          selectedTag === 'all'
                            ? 'bg-primary text-white font-semibold shadow-sm'
                            : 'text-gray-700 bg-gray-50 border border-gray-200'
                        }`}
                      >
                        All Collections
                      </button>
                      <button
                        onClick={() => { setSelectedTag(prev => prev === 'bestseller' ? 'all' : 'bestseller'); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                          selectedTag === 'bestseller'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-amber-800 bg-amber-50 border border-amber-200'
                        }`}
                      >
                        <span>🔥 Bestseller Fabrics</span>
                      </button>
                      <button
                        onClick={() => { setSelectedTag(prev => prev === 'new' ? 'all' : 'new'); setShowMobileFilters(false); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                          selectedTag === 'new'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        <span>✨ New Arrivals</span>
                      </button>
                    </div>
                  </div>

                  {/* Price Category Filter */}
                  <div>
                    <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Price Category (₹400 – ₹4,000)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {priceRanges.map(pr => (
                        <button
                          key={pr.value}
                          onClick={() => { setSelectedPriceRange(pr.value); setShowMobileFilters(false); }}
                          className={`text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            selectedPriceRange === pr.value
                              ? 'bg-primary text-white font-bold shadow-sm'
                              : 'text-gray-700 bg-gray-50 border border-gray-200 font-medium'
                          }`}
                        >
                          <span>{pr.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fabric Material Type */}
                  <div>
                    <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Fabric Material Type
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {fabrics.map(fab => (
                        <button
                          key={fab}
                          onClick={() => { setSelectedFabric(fab); setShowMobileFilters(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm capitalize transition-colors ${
                            selectedFabric === fab
                              ? 'bg-primary text-white font-semibold shadow-sm'
                              : 'text-gray-700 bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {fab === 'all' ? 'All Fabric Types' : fab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saree Style Category */}
                  <div>
                    <h4 className="text-xs font-accent font-semibold uppercase tracking-wider text-gray-500 mb-3">
                      Saree Style Category
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setShowMobileFilters(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm capitalize transition-colors ${
                            selectedCategory === cat
                              ? 'bg-primary text-white font-semibold shadow-sm'
                              : 'text-gray-700 bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Drawer Footer Action */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-2xl text-center text-sm shadow-md"
                  >
                    Apply Filters ({filteredAndSortedProducts.length} items)
                  </button>
                </div>
              </div>
            )}

            {/* Product Display Area */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="text-center py-24 text-gray-500 text-sm">Loading catalog items...</div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-8">
                  <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-800 text-lg mb-1">No Blouse Fabrics Found</h3>
                  <p className="text-xs text-gray-500 mb-6">
                    {products.length === 0
                      ? 'The fabric catalog is currently being updated. Please check back soon!'
                      : 'Try adjusting your selected price range, fabric type, or color picker match.'}
                  </p>
                  <button onClick={clearFilters} className="btn-primary text-xs px-6 py-3 rounded-full uppercase tracking-wider">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Results Count & Badges Header */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                    <span>
                      Page <strong className="text-gray-900">{currentPage}</strong> of <strong className="text-gray-900">{totalPages}</strong> ({filteredAndSortedProducts.length} total items)
                    </span>
                    <span className="text-[11px] font-semibold text-gray-600">Showing max 20 items per page</span>
                  </div>

                  {viewMode === 'grid' ? (
                    /* GRID VIEW MODE WITH TOUCH SWIPE (20 MAX PER PAGE) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {paginatedProducts.map(product => {
                        const waUrl = getWhatsAppLink(getProductInquiryMessage(product))
                        const hex = product.specifications?.hexColor || '#C4204F'
                        const activeImg = getActiveImage(product)
                        const hasMultiImages = product.images && product.images.length > 1 && product.images[0] !== '/images/logo.svg'

                        return (
                          <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            
                            {/* Image Box with Touch Swipe */}
                            <div
                              onTouchStart={(e) => handleTouchStart(product.id, e.touches[0].clientX)}
                              onTouchEnd={(e) => handleTouchEnd(product, e.changedTouches[0].clientX)}
                              className="relative aspect-[3/4] bg-[#FAF8F5] flex items-center justify-center p-6 border-b border-gray-100 touch-pan-y"
                            >
                              <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" />

                              {/* Color Swatch Badge */}
                              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm z-10 pointer-events-none">
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                                <span className="text-[10px] font-bold text-gray-700">{product.specifications?.color}</span>
                              </div>

                              {/* Bestseller / New Collection Badges */}
                              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
                                {product.isBestseller && (
                                  <span className="bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                    🔥 Bestseller
                                  </span>
                                )}
                                {product.isNewCollection && (
                                  <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                    ✨ New
                                  </span>
                                )}
                                {!product.available && (
                                  <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                                    Out of Stock
                                  </span>
                                )}
                              </div>

                              {/* Mobile Swipe Hint Badge */}
                              {hasMultiImages && (
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full z-10 sm:hidden">
                                  Swipe ↔
                                </div>
                              )}

                              {activeImg ? (
                                <img
                                  src={activeImg}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                                />
                              ) : (
                                /* Heart-shaped SVG Color Swatch when no images exist */
                                <div className="flex flex-col items-center justify-center space-y-3 py-6 pointer-events-none">
                                  <svg
                                    className="w-32 h-32 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
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

                            <div className="p-5 flex-grow flex flex-col justify-between">
                              <div>
                                {/* Horizontal Thumbnail Strip */}
                                {hasMultiImages && (
                                  <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                                    {product.images.map((img, idx) => (
                                      <button
                                        key={idx}
                                        onMouseEnter={() => setHoveredImageIndices(prev => ({ ...prev, [product.id]: idx }))}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setHoveredImageIndices(prev => ({ ...prev, [product.id]: idx }))
                                        }}
                                        className={`w-7 h-7 rounded-md overflow-hidden border transition-all flex-shrink-0 ${
                                          (hoveredImageIndices[product.id] === idx || (hoveredImageIndices[product.id] === undefined && idx === 0))
                                            ? 'border-primary ring-1 ring-primary'
                                            : 'border-gray-200 opacity-60 hover:opacity-100'
                                        }`}
                                      >
                                        <img src={getCleanImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                      </button>
                                    ))}
                                  </div>
                                )}

                                <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
                                  <h3 className="font-heading text-base font-bold text-gray-900 mb-1">{product.name}</h3>
                                </Link>

                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description.short}</p>
                                
                                <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-4">
                                  {product.specifications?.fabric && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{product.specifications.fabric}</span>
                                  )}
                                  {product.specifications?.cutLength && (
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{product.specifications.cutLength}</span>
                                  )}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className="font-accent font-bold text-primary text-base">{product.priceDisplay}</span>
                                {product.available ? (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Inquire</span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-gray-400 font-semibold px-3 py-2 bg-gray-100 rounded-lg">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    /* AMAZON-STYLE DETAILED LIST VIEW MODE (20 MAX PER PAGE) */
                    <div className="space-y-6">
                      {paginatedProducts.map(product => {
                        const waUrl = getWhatsAppLink(getProductInquiryMessage(product))
                        const hex = product.specifications?.hexColor || '#C4204F'
                        const activeImg = getActiveImage(product)
                        const hasMultiImages = product.images && product.images.length > 1 && product.images[0] !== '/images/logo.svg'

                        return (
                          <div key={product.id} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                            
                            {/* Image Preview & Touch Swipe Column */}
                            <div className="w-full sm:w-56 flex-shrink-0 flex flex-col items-center">
                              <div
                                onTouchStart={(e) => handleTouchStart(product.id, e.touches[0].clientX)}
                                onTouchEnd={(e) => handleTouchEnd(product, e.changedTouches[0].clientX)}
                                className="relative aspect-[3/4] w-full bg-[#FAF8F5] rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-3 mb-3 touch-pan-y"
                              >
                                <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" />

                                {/* Swatch Badge */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
                                  <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />
                                  <span className="text-[10px] font-bold text-gray-700">{product.specifications?.color}</span>
                                </div>

                                {activeImg ? (
                                  <img src={activeImg} alt={product.name} className="w-full h-full object-cover rounded-lg pointer-events-none" />
                                ) : (
                                  <svg
                                    className="w-24 h-24 drop-shadow-md pointer-events-none"
                                    viewBox="0 0 24 24"
                                    fill={hex}
                                    stroke="#FFFFFF"
                                    strokeWidth="0.8"
                                  >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                )}
                              </div>

                              {/* Hover Thumbnail Strip */}
                              {hasMultiImages && (
                                <div className="flex items-center justify-center gap-1.5 w-full overflow-x-auto">
                                  {product.images.map((img, idx) => (
                                    <button
                                      key={idx}
                                      onMouseEnter={() => setHoveredImageIndices(prev => ({ ...prev, [product.id]: idx }))}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setHoveredImageIndices(prev => ({ ...prev, [product.id]: idx }))
                                      }}
                                      className={`w-8 h-8 rounded-md overflow-hidden border transition-all ${
                                        (hoveredImageIndices[product.id] === idx || (hoveredImageIndices[product.id] === undefined && idx === 0))
                                          ? 'border-primary ring-2 ring-primary/20'
                                          : 'border-gray-200 opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      <img src={getCleanImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Middle Info Column */}
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                                    {product.category}
                                  </span>
                                  {product.isBestseller && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                                      🔥 Bestseller
                                    </span>
                                  )}
                                  {product.isNewCollection && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                                      ✨ New Arrival
                                    </span>
                                  )}
                                  <span className="text-[11px] text-gray-400">• High Demand Fabric</span>
                                </div>

                                <Link href={`/product/${product.id}`} className="block group">
                                  <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>

                                <p className="text-xs sm:text-sm text-gray-600 my-3 line-clamp-2 sm:line-clamp-3">
                                  {product.description.full || product.description.short}
                                </p>

                                {/* Amazon Spec Badges */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                  <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Fabric Material</span>
                                    <span className="font-semibold">{product.specifications?.fabric || 'Pure Silk'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Cut Length</span>
                                    <span className="font-semibold">{product.specifications?.cutLength || '1.0 Meter'}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Weave Type</span>
                                    <span className="font-semibold">{product.specifications?.work || 'Hand Loom'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Amazon Delivery & Guarantee tags */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                  <Truck className="w-3.5 h-3.5" /> Express Dispatch (24-48 hrs)
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 100% Authentic Fabric Guarantee
                                </span>
                              </div>
                            </div>

                            {/* Right Buy & Price Action Card */}
                            <div className="w-full sm:w-48 flex-shrink-0 bg-[#FAF8F5] p-4 rounded-xl border border-gray-200/70 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Estimated Price</span>
                                <span className="font-accent text-2xl font-extrabold text-primary block my-1">
                                  {product.priceDisplay}
                                </span>
                                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mb-3">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock &amp; Ready to Ship
                                </span>
                                <p className="text-[11px] text-gray-500 mb-4">
                                  Custom tailoring &amp; embroidery available on WhatsApp inquiry.
                                </p>
                              </div>

                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp w-full text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-transform"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Inquire on WhatsApp</span>
                              </a>
                            </div>

                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* PAGINATION CONTROL BAR */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.max(1, p - 1))
                          window.scrollTo({ top: 300, behavior: 'smooth' })
                        }}
                        disabled={currentPage === 1}
                        className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Page</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {[...Array(totalPages)].map((_, idx) => {
                          const pageNum = idx + 1
                          return (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setCurrentPage(pageNum)
                                window.scrollTo({ top: 300, behavior: 'smooth' })
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                currentPage === pageNum
                                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.min(totalPages, p + 1))
                          window.scrollTo({ top: 300, behavior: 'smooth' })
                        }}
                        disabled={currentPage === totalPages}
                        className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span>Next Page</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
