'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, LogOut, Package, Palette, Upload, Image as ImageIcon, Download, ShieldCheck, Sparkles, Edit3, X, Check, Settings } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Product } from '@/types'
import { getColorNameFromHex } from '@/lib/colors'

const DEFAULT_PRODUCT_NAME_OPTIONS = [
  'Netted Tissue Fabric',
  'Semi silk fabric',
  'Tissue fabric'
]

const DEFAULT_CATEGORY_OPTIONS = [
  'Bridal',
  'Semi Bridal',
  'Casual'
]

const DEFAULT_CRAFT_WORK_OPTIONS = [
  'Gold Zari (Hand work)',
  'Silver Zari (Hand work)',
  'Beadwork (Hand work)',
  'Embroidary (Machine)'
]

const CUT_LENGTH_OPTIONS = [
  '1.0 Meter (Unstitched)',
  '1.2 Meters (Unstitched)',
  '1.5 Meters (Unstitched)'
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<'admin' | 'superadmin'>('admin')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  // Super Admin Configurable Dropdown Options & Default Descriptions
  const [productNameOptions, setProductNameOptions] = useState<string[]>(DEFAULT_PRODUCT_NAME_OPTIONS)
  const [categoryOptions, setCategoryOptions] = useState<string[]>(DEFAULT_CATEGORY_OPTIONS)
  const [craftWorkOptions, setCraftWorkOptions] = useState<string[]>(DEFAULT_CRAFT_WORK_OPTIONS)
  const [descriptionsMap, setDescriptionsMap] = useState<Record<string, { short: string; full: string }>>({
    'Netted Tissue Fabric': {
      short: 'Exquisite Netted Tissue Fabric featuring shimmering sheer texture and elegant metallic weave.',
      full: 'Premium unstitched Netted Tissue Fabric (1.0m to 1.2m cut). High-grade lightweight netted sheer texture with rich borders, offering effortless drape and luxurious bridal appeal.'
    },
    'Semi silk fabric': {
      short: 'Lustrous Semi Silk Fabric with soft texture, traditional luster, and rich zari finish.',
      full: 'Fine unstitched Semi Silk Fabric (1.0m to 1.2m cut). Offers the rich shine of pure silk with enhanced durability and smooth comfort for grand celebrations.'
    },
    'Tissue fabric': {
      short: 'Ultra-rich metallic Tissue Fabric with glowing sheen and delicate artisan weaving.',
      full: 'Exclusive unstitched Tissue Fabric material (1.0m to 1.2m cut). Signature golden/silver metallic sheen suitable for heavy designer blouse patterns.'
    }
  })

  // Super Admin Option Management Inputs
  const [newProductName, setNewProductName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCraftWorkName, setNewCraftWorkName] = useState('')
  const [selectedDescFabric, setSelectedDescFabric] = useState(DEFAULT_PRODUCT_NAME_OPTIONS[0])
  const [customShortDesc, setCustomShortDesc] = useState('')
  const [customFullDesc, setCustomFullDesc] = useState('')

  // Edit Mode State
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState(DEFAULT_PRODUCT_NAME_OPTIONS[0])
  const [category, setCategory] = useState(DEFAULT_CATEGORY_OPTIONS[0])
  const [price, setPrice] = useState('3500')
  const [cutLength, setCutLength] = useState(CUT_LENGTH_OPTIONS[0])
  const [work, setWork] = useState(DEFAULT_CRAFT_WORK_OPTIONS[0])
  const [hexColor, setHexColor] = useState('#C4204F')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')

  // 3 Raw Fabric Image Upload States (for Form)
  const [frontImageUrl, setFrontImageUrl] = useState('')
  const [frontFileName, setFrontFileName] = useState('')
  const [backImageUrl, setBackImageUrl] = useState('')
  const [backFileName, setBackFileName] = useState('')
  const [handImageUrl, setHandImageUrl] = useState('')
  const [handFileName, setHandFileName] = useState('')

  // 2 Super Admin Rendered Blouse Image Upload States (for Form)
  const [renderedFrontUrl, setRenderedFrontUrl] = useState('')
  const [renderedFrontFileName, setRenderedFrontFileName] = useState('')
  const [renderedBackUrl, setRenderedBackUrl] = useState('')
  const [renderedBackFileName, setRenderedBackFileName] = useState('')

  // Per-Product Upload State for Catalog List
  const [productRenders, setProductRenders] = useState<{
    [productId: string]: {
      frontUrl?: string
      frontName?: string
      backUrl?: string
      backName?: string
    }
  }>({})

  const [featured, setFeatured] = useState(false)
  const [isBestseller, setIsBestseller] = useState(false)
  const [isNewCollection, setIsNewCollection] = useState(false)

  // Dashboard Active Tab State ('manage' | 'add' | 'settings')
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'settings'>('manage')

  // Catalog Filtering & Pagination State
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('')
  const [catalogCurrentPage, setCatalogCurrentPage] = useState(1)
  const [catalogItemsPerPage, setCatalogItemsPerPage] = useState(10)

  // Derived color name from hex color wheel
  const derivedColorName = getColorNameFromHex(hexColor)

  // Preset Swatches
  const presetSwatches = [
    { name: 'Crimson Pink', hex: '#C4204F' },
    { name: 'Royal Maroon', hex: '#800020' },
    { name: 'Champagne Gold', hex: '#C9A96E' },
    { name: 'Royal Blue', hex: '#002D62' },
    { name: 'Emerald Green', hex: '#046307' },
    { name: 'Pastel Pink', hex: '#E27D9B' },
    { name: 'Mustard Gold', hex: '#E5A000' },
    { name: 'Charcoal Black', hex: '#1A1A1A' }
  ]

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/session')
        const data = await res.json()
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true)
          setUserRole(data.role || 'admin')
          fetchProducts()
          fetchSettings()
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.productNames && data.productNames.length > 0) {
        setProductNameOptions(data.productNames)
        setName(data.productNames[0])
      }
      if (data.categories && data.categories.length > 0) {
        setCategoryOptions(data.categories)
        setCategory(data.categories[0])
      }
      if (data.craftWorks && data.craftWorks.length > 0) {
        setCraftWorkOptions(data.craftWorks)
        setWork(data.craftWorks[0])
      }
      if (data.descriptions) {
        setDescriptionsMap(data.descriptions)
        const firstFabric = data.productNames?.[0] || 'Netted Tissue Fabric'
        setSelectedDescFabric(firstFabric)
        setCustomShortDesc(data.descriptions[firstFabric]?.short || '')
        setCustomFullDesc(data.descriptions[firstFabric]?.full || '')

        // Infill default descriptions for initial selection
        if (data.descriptions[firstFabric]) {
          setShortDescription(data.descriptions[firstFabric].short)
          setFullDescription(data.descriptions[firstFabric].full)
        }
      }
    } catch (err) {
      console.error('Failed to load settings', err)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFabricProductNameChange = (selectedName: string) => {
    setName(selectedName)
    const desc = descriptionsMap[selectedName]
    if (desc) {
      setShortDescription(desc.short)
      setFullDescription(desc.full)
    } else {
      setShortDescription(`Exquisite ${selectedName} material featuring rich texture and fine craftsmanship.`)
      setFullDescription(`Premium unstitched ${selectedName} (1.0m to 1.2m cut). Perfect for custom blouse tailoring.`)
    }
  }

  const resetAddProductForm = () => {
    setEditingProductId(null)
    setMessage('')
    setActiveTab('manage')
    const firstFabric = productNameOptions[0] || 'Netted Tissue Fabric'
    setName(firstFabric)
    setCategory(categoryOptions[0] || 'Bridal')
    setPrice('3500')
    setCutLength(CUT_LENGTH_OPTIONS[0])
    setWork(craftWorkOptions[0] || 'Gold Zari (Hand work)')
    setHexColor('#C4204F')

    const desc = descriptionsMap[firstFabric]
    if (desc) {
      setShortDescription(desc.short)
      setFullDescription(desc.full)
    } else {
      setShortDescription('')
      setFullDescription('')
    }

    setFrontImageUrl('')
    setFrontFileName('')
    setBackImageUrl('')
    setBackFileName('')
    setHandImageUrl('')
    setHandFileName('')
    setRenderedFrontUrl('')
    setRenderedFrontFileName('')
    setRenderedBackUrl('')
    setRenderedBackFileName('')
    setFeatured(false)
    setIsBestseller(false)
    setIsNewCollection(false)
  }

  const handleStartEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    
    // Strip color suffix if present to get clean base name
    const rawName = product.name.split(' - ')[0].trim()
    setName(rawName)
    setCategory(product.category)
    setPrice(String(product.price))
    setCutLength(product.specifications?.cutLength || CUT_LENGTH_OPTIONS[0])
    setWork(product.specifications?.work || craftWorkOptions[0] || 'Gold Zari (Hand work)')
    setHexColor(product.specifications?.hexColor || '#C4204F')
    setShortDescription(product.description?.short || '')
    setFullDescription(product.description?.full || '')
    setFeatured(product.featured)
    setIsBestseller(!!product.isBestseller)
    setIsNewCollection(!!product.isNewCollection)
    setActiveTab('add')
    setMessage(`Editing Product ${product.sku}... Update details and click Save Changes.`)

    // Pre-populate images
    if (product.images && product.images.length > 0) {
      if (product.images.length >= 5) {
        setRenderedFrontUrl(product.images[0])
        setRenderedBackUrl(product.images[1])
        setFrontImageUrl(product.images[2])
        setBackImageUrl(product.images[3])
        setHandImageUrl(product.images[4])
      } else {
        setFrontImageUrl(product.images[0] || '')
        setBackImageUrl(product.images[1] || '')
        setHandImageUrl(product.images[2] || '')
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
    } catch {
      // Ignore network errors on logout
    }
    sessionStorage.removeItem('ragas_admin_token')
    sessionStorage.removeItem('ragas_admin_role')
    router.push('/admin/login')
  }

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFrontFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setFrontImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setBackImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHandImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHandFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setHandImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRenderedFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRenderedFrontFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setRenderedFrontUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRenderedBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRenderedBackFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setRenderedBackUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Per-Product Upload Handlers for Super Admin
  const handleProductRenderFrontUpload = (productId: string, file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProductRenders(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            frontUrl: reader.result as string,
            frontName: file.name
          }
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleProductRenderBackUpload = (productId: string, file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProductRenders(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            backUrl: reader.result as string,
            backName: file.name
          }
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    const imageList: string[] = []
    if (renderedFrontUrl) imageList.push(renderedFrontUrl)
    if (renderedBackUrl) imageList.push(renderedBackUrl)
    
    if (frontImageUrl) imageList.push(frontImageUrl)
    if (backImageUrl) imageList.push(backImageUrl)
    if (handImageUrl) imageList.push(handImageUrl)

    const isEdit = !!editingProductId
    
    // Automatically append color to item name
    const cleanBaseName = name.split(' - ')[0].trim()
    const finalSavedName = `${cleanBaseName} - ${derivedColorName}`

    try {
      const url = '/api/products'
      const method = isEdit ? 'PUT' : 'POST'
      const payload: any = {
        id: editingProductId,
        name: finalSavedName,
        category,
        price,
        fabric: cleanBaseName, // Inferred fabric material
        cutLength,
        work,
        colorName: derivedColorName,
        hexColor,
        shortDescription: shortDescription || `${finalSavedName} featuring ${work}.`,
        fullDescription: fullDescription || `Premium unstitched ${cleanBaseName} (${cutLength}) in ${derivedColorName}. Handcrafted with ${work}.`,
        featured,
        isBestseller,
        isNewCollection,
      }

      if (imageList.length > 0) {
        payload.images = imageList
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (result.success) {
        setMessage(isEdit ? `Updated product details successfully!` : `Product added successfully! SKU: ${result.product.sku}`)
        resetAddProductForm()
        fetchProducts()
        setActiveTab('manage')
      } else {
        setMessage('Failed to save product: ' + result.error)
      }
    } catch (err) {
      setMessage('Error saving product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUploadBlouseRendersForProduct = async (product: Product) => {
    const itemData = productRenders[product.id]
    if (!itemData?.frontUrl && !itemData?.backUrl) {
      alert('Please select at least 1 stitched blouse render (Front or Back) before saving.')
      return
    }

    try {
      const currentImages = Array.isArray(product.images) ? [...product.images] : []

      // Extract existing stitched front/back images (if any exist)
      let stitchedFront = currentImages.find(img => img && (img.startsWith('stitched_front:') || img.includes('stitched-front')))
      let stitchedBack = currentImages.find(img => img && (img.startsWith('stitched_back:') || img.includes('stitched-back')))

      // PRESERVE ALL RAW FABRIC PHOTOS:
      // Keep any image that is not a stitched front/back render
      const rawFabricPhotos = currentImages.filter(img => 
        img && 
        !img.startsWith('stitched_front:') && 
        !img.startsWith('stitched_back:') && 
        !img.includes('stitched-front') && 
        !img.includes('stitched-back')
      )

      // If Super Admin provided a new Front Render, set or replace stitchedFront
      if (itemData?.frontUrl) {
        const urlStr = itemData.frontUrl
        stitchedFront = urlStr.startsWith('stitched_front:') ? urlStr : `stitched_front:${urlStr}`
      }

      // If Super Admin provided a new Back Render, set or replace stitchedBack
      if (itemData?.backUrl) {
        const urlStr = itemData.backUrl
        stitchedBack = urlStr.startsWith('stitched_back:') ? urlStr : `stitched_back:${urlStr}`
      }

      // Build complete image array: Stitched Front, Stitched Back, followed by ALL original fabric photos
      const updatedImages: string[] = []
      if (stitchedFront) updatedImages.push(stitchedFront)
      if (stitchedBack) updatedImages.push(stitchedBack)
      
      // Always append all original raw fabric photos
      if (rawFabricPhotos.length > 0) {
        updatedImages.push(...rawFabricPhotos)
      } else if (!stitchedFront && !stitchedBack) {
        updatedImages.push('/images/logo.svg')
      }

      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          images: updatedImages
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMessage(`Saved Stitched Render(s) for ${product.sku} successfully while preserving all fabric photos!`)
        setProductRenders(prev => {
          const copy = { ...prev }
          delete copy[product.id]
          return copy
        })
        fetchProducts()
      } else {
        alert('Failed to save stitched render: ' + (data.error || 'Server error'))
      }
    } catch (err) {
      console.error('Render upload error', err)
      alert('Error uploading stitched blouse render.')
    }
  }

  const handleRemoveSingleImageFromProduct = async (product: Product, imageIndexToRemove: number) => {
    const imageToRemove = product.images[imageIndexToRemove]
    
    // Check if the image is a stitched render
    const isStitchedImage = imageToRemove && (
      imageToRemove.startsWith('stitched_front:') ||
      imageToRemove.startsWith('stitched_back:') ||
      imageToRemove.includes('stitched-front') ||
      imageToRemove.includes('stitched-back')
    )

    if (isStitchedImage && userRole !== 'superadmin') {
      alert('🔒 Permission Denied: Only Super Admin is authorized to remove Stitched Front or Stitched Back photos.')
      return
    }

    if (!confirm(`Are you sure you want to remove image #${imageIndexToRemove + 1} from ${product.sku}?`)) return

    try {
      const updatedImages = product.images.filter((_, idx) => idx !== imageIndexToRemove)
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          images: updatedImages
        })
      })

      if (res.ok) {
        setMessage(`Removed image #${imageIndexToRemove + 1} from ${product.sku}`)
        fetchProducts()
      }
    } catch (err) {
      console.error('Error removing image', err)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product entirely?')) return

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error('Delete error', err)
    }
  }

  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, available: !currentStatus })
      })
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, available: !currentStatus } : p))
      }
    } catch (err) {
      console.error('Stock toggle error', err)
    }
  }

  // Super Admin Option Management Functions
  const handleAddProductNameOption = () => {
    if (!newProductName.trim()) return
    const updated = [...productNameOptions, newProductName.trim()]
    setProductNameOptions(updated)
    setNewProductName('')
    saveAdminSettings({ productNames: updated })
  }

  const handleRemoveProductNameOption = (optToRemove: string) => {
    if (productNameOptions.length <= 1) {
      alert('Must keep at least 1 Fabric Product Name option.')
      return
    }
    const updated = productNameOptions.filter(o => o !== optToRemove)
    setProductNameOptions(updated)
    if (name === optToRemove) setName(updated[0])
    saveAdminSettings({ productNames: updated })
  }

  const handleAddCategoryOption = () => {
    if (!newCategoryName.trim()) return
    const updated = [...categoryOptions, newCategoryName.trim()]
    setCategoryOptions(updated)
    setNewCategoryName('')
    saveAdminSettings({ categories: updated })
  }

  const handleRemoveCategoryOption = (catToRemove: string) => {
    if (categoryOptions.length <= 1) {
      alert('Must keep at least 1 Category option.')
      return
    }
    const updated = categoryOptions.filter(c => c !== catToRemove)
    setCategoryOptions(updated)
    if (category === catToRemove) setCategory(updated[0])
    saveAdminSettings({ categories: updated })
  }

  const handleAddCraftWorkOption = () => {
    if (!newCraftWorkName.trim()) return
    const updated = [...craftWorkOptions, newCraftWorkName.trim()]
    setCraftWorkOptions(updated)
    setNewCraftWorkName('')
    saveAdminSettings({ craftWorks: updated })
  }

  const handleRemoveCraftWorkOption = (workToRemove: string) => {
    if (craftWorkOptions.length <= 1) {
      alert('Must keep at least 1 Craft Work option.')
      return
    }
    const updated = craftWorkOptions.filter(w => w !== workToRemove)
    setCraftWorkOptions(updated)
    if (work === workToRemove) setWork(updated[0])
    saveAdminSettings({ craftWorks: updated })
  }

  const handleSaveFabricDescription = () => {
    if (!selectedDescFabric) return
    const updatedMap = {
      ...descriptionsMap,
      [selectedDescFabric]: {
        short: customShortDesc,
        full: customFullDesc
      }
    }
    setDescriptionsMap(updatedMap)
    saveAdminSettings({ descriptions: updatedMap })
    setMessage(`Updated default descriptions for ${selectedDescFabric}!`)
  }

  const saveAdminSettings = async (override?: any) => {
    const payload = {
      productNames: override?.productNames || productNameOptions,
      categories: override?.categories || categoryOptions,
      craftWorks: override?.craftWorks || craftWorkOptions,
      descriptions: override?.descriptions || descriptionsMap
    }
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await res.json()
      if (result.success) {
        setMessage('Super Admin Options updated & saved successfully!')
      }
    } catch (err) {
      console.error('Error saving admin settings', err)
    }
  }

  const nextSkuPreview = String(products.length + 1).padStart(3, '0')

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Admin...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-grow py-10 md:py-16">
        <div className="container-custom">
          
          {/* Admin Header Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 mb-10 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Ragas Boutique Catalog Management</span>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                  userRole === 'superadmin' ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {userRole === 'superadmin' ? '👑 Super Admin Mode' : '👤 Regular Admin Mode'}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900">
                {userRole === 'superadmin' ? 'Super Admin Portal' : 'Admin Fabric Upload & Edit Portal'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/products" className="btn-outline text-xs px-4 py-2.5 rounded-xl uppercase">
                View Live Site
              </Link>
              <button
                onClick={handleLogout}
                className="btn-ghost text-xs px-4 py-2.5 rounded-xl uppercase text-red-600 hover:bg-red-50 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Header */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog Products ({products.length})</span>
            </button>

            <button
              onClick={() => {
                if (activeTab !== 'add' && !editingProductId) {
                  resetAddProductForm()
                }
                setActiveTab('add')
              }}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {editingProductId ? <Edit3 className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
              <span>{editingProductId ? `Edit Product Details` : 'Add New Product'}</span>
            </button>

            {userRole === 'superadmin' && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-purple-700 text-white shadow-md'
                    : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                <Settings className="w-4 h-4 text-purple-300" />
                <span>⚙️ Options &amp; Settings</span>
              </button>
            )}

            {editingProductId && (
              <button
                onClick={() => {
                  resetAddProductForm()
                  setActiveTab('manage')
                }}
                className="ml-auto text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl border border-red-200 flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Editing Product</span>
              </button>
            )}
          </div>

          {/* Add / Edit Product Form Tab */}
          {activeTab === 'add' && (
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h2 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                  {editingProductId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-primary" />}
                  <span>{editingProductId ? 'Edit Product Details' : 'Add Blouse Fabric Item'}</span>
                </h2>
                
                {editingProductId ? (
                  <button
                    onClick={resetAddProductForm}
                    className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                ) : (
                  <div className="bg-primary/10 text-primary text-xs font-mono font-bold px-3 py-1 rounded-full">
                    Auto SKU: {nextSkuPreview}
                  </div>
                )}
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-xl text-xs font-semibold text-center ${
                  message.includes('success') || message.includes('Updated') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleAddOrUpdateProduct} className="space-y-5">
                {/* Product Name Dropdown */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Fabric Product Name</label>
                  <select
                    value={name}
                    onChange={(e) => handleFabricProductNameChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {productNameOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    ✨ Note: Color name (<strong>{derivedColorName}</strong>) will be appended automatically on save: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-primary">{name} - {derivedColorName}</code>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="3500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Color Wheel & Automatic Color Name */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-4">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-start gap-2 shadow-sm">
                    <span className="text-xs text-gray-500 font-semibold flex-shrink-0">Derived Color Name:</span>
                    <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-lg">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: hexColor }}
                      />
                      <span className="text-xs font-bold text-primary">
                        {derivedColorName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <label className="text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-primary" />
                      <span>Select Color from Wheel</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hexColor}
                        onChange={(e) => setHexColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-sm cursor-pointer p-0 bg-transparent flex-shrink-0"
                      />
                      <span className="text-xs font-mono font-bold uppercase text-gray-700 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200">{hexColor}</span>
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-semibold mb-2">Quick Color Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {presetSwatches.map((swatch) => (
                        <button
                          key={swatch.name}
                          type="button"
                          onClick={() => setHexColor(swatch.hex)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-white border border-gray-200 hover:border-primary transition-colors"
                        >
                          <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: swatch.hex }} />
                          <span>{swatch.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cut Length Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Cut Length</label>
                    <select
                      value={cutLength}
                      onChange={(e) => setCutLength(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {CUT_LENGTH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Craft Work Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Craft / Embroidery Work</label>
                    <select
                      value={work}
                      onChange={(e) => setWork(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {craftWorkOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3 Raw Fabric Image Upload Controls (Admin & Super Admin) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 space-y-4">
                  <label className="block text-xs font-bold uppercase text-gray-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span>Upload Raw Fabric Photos (Front, Back &amp; Sleeve/Hand)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Front Fabric Image Input */}
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">1. Front Neck Fabric</span>
                      <label className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-center">
                        <Upload className="w-4 h-4 text-primary mb-1" />
                        <span className="text-[10px] font-medium text-gray-700 truncate w-full">{frontFileName || (frontImageUrl ? 'Front Image Loaded' : 'Select front.png')}</span>
                        <input type="file" accept="image/*" onChange={handleFrontImageUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Back Fabric Image Input */}
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">2. Back Neck Fabric</span>
                      <label className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-center">
                        <Upload className="w-4 h-4 text-primary mb-1" />
                        <span className="text-[10px] font-medium text-gray-700 truncate w-full">{backFileName || (backImageUrl ? 'Back Image Loaded' : 'Select Back.png')}</span>
                        <input type="file" accept="image/*" onChange={handleBackImageUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Sleeve/Hand Fabric Image Input */}
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">3. Sleeve/Hand Fabric</span>
                      <label className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-center">
                        <Upload className="w-4 h-4 text-primary mb-1" />
                        <span className="text-[10px] font-medium text-gray-700 truncate w-full">{handFileName || (handImageUrl ? 'Hand Image Loaded' : 'Select Hand.png')}</span>
                        <input type="file" accept="image/*" onChange={handleHandImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Super Admin Rendered Blouse Image Upload */}
                {userRole === 'superadmin' && (
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-4">
                    <label className="block text-xs font-bold uppercase text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Super Admin: Upload 2 Stitched Blouse Renders (Front &amp; Back)</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="block text-[11px] font-semibold text-purple-800 mb-1">Rendered Front View</span>
                        <label className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-colors text-center">
                          <Upload className="w-4 h-4 text-purple-600 mb-1" />
                          <span className="text-[10px] font-medium text-gray-700 truncate w-full">{renderedFrontFileName || (renderedFrontUrl ? 'Front Render Loaded' : 'Select Front Render')}</span>
                          <input type="file" accept="image/*" onChange={handleRenderedFrontUpload} className="hidden" />
                        </label>
                      </div>

                      <div>
                        <span className="block text-[11px] font-semibold text-purple-800 mb-1">Rendered Back View</span>
                        <label className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-colors text-center">
                          <Upload className="w-4 h-4 text-purple-600 mb-1" />
                          <span className="text-[10px] font-medium text-gray-700 truncate w-full">{renderedBackFileName || (renderedBackUrl ? 'Back Render Loaded' : 'Select Back Render')}</span>
                          <input type="file" accept="image/*" onChange={handleRenderedBackUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary of fabric texture and design..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Full details on fabric quality, zari work, weaving style..."
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="block text-[11px] font-bold uppercase text-gray-500">Badges &amp; Collections Promotion</span>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="featured" className="text-xs font-semibold text-gray-700">Homepage Featured</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bestseller"
                        checked={isBestseller}
                        onChange={(e) => setIsBestseller(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                      />
                      <label htmlFor="bestseller" className="text-xs font-bold text-amber-800">🔥 Bestseller Badge</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="newCollection"
                        checked={isNewCollection}
                        onChange={(e) => setIsNewCollection(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                      />
                      <label htmlFor="newCollection" className="text-xs font-bold text-emerald-800">✨ New Collection Tag</label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md mt-4 transition-all ${
                    editingProductId ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'btn-primary'
                  }`}
                >
                  {submitting ? 'Saving Changes...' : (editingProductId ? '💾 Save Product Changes' : 'Publish Product to Catalog')}
                </button>
              </form>
            </div>
          )}

          {/* Super Admin Options & Settings Management Tab */}
          {activeTab === 'settings' && userRole === 'superadmin' && (
            <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-purple-100 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-purple-900 flex items-center gap-2">
                      <Settings className="w-6 h-6 text-purple-600" />
                      <span>Super Admin Dropdown Options &amp; Descriptions Control</span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Add, edit, or remove dropdown options and set custom default descriptions for each fabric product name.</p>
                  </div>
                </div>

                {message && (
                  <div className="p-4 rounded-xl text-xs font-semibold text-center bg-purple-50 text-purple-900 border border-purple-200">
                    {message}
                  </div>
                )}

                {/* Section 1: Fabric Product Names Manager */}
                <div className="p-6 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-bold uppercase text-purple-900">1. Fabric Product Names</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {productNameOptions.map((opt) => (
                      <div key={opt} className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-xs text-xs font-semibold text-gray-800">
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProductNameOption(opt)}
                          className="text-gray-400 hover:text-red-600"
                          title="Remove option"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add new Fabric Product Name..."
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddProductNameOption}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-purple-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Section 2: Categories Manager */}
                <div className="p-6 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-bold uppercase text-purple-900">2. Product Categories</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => (
                      <div key={cat} className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-xs text-xs font-semibold text-gray-800">
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategoryOption(cat)}
                          className="text-gray-400 hover:text-red-600"
                          title="Remove category"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add new Category..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategoryOption}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-purple-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Section 3: Craft / Embroidery Work Manager */}
                <div className="p-6 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-bold uppercase text-purple-900">3. Craft / Embroidery Work Options</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {craftWorkOptions.map((workOpt) => (
                      <div key={workOpt} className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-xs text-xs font-semibold text-gray-800">
                        <span>{workOpt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCraftWorkOption(workOpt)}
                          className="text-gray-400 hover:text-red-600"
                          title="Remove craft option"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add new Craft / Embroidery Work..."
                      value={newCraftWorkName}
                      onChange={(e) => setNewCraftWorkName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddCraftWorkOption}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-purple-700"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Section 4: Default Descriptions per Fabric Product Name */}
                <div className="p-6 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-5">
                  <h3 className="text-sm font-bold uppercase text-purple-900">4. Custom Default Descriptions for Fabric Product Names</h3>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Select Fabric Product Name to Configure:</label>
                    <select
                      value={selectedDescFabric}
                      onChange={(e) => {
                        const fab = e.target.value
                        setSelectedDescFabric(fab)
                        setCustomShortDesc(descriptionsMap[fab]?.short || '')
                        setCustomFullDesc(descriptionsMap[fab]?.full || '')
                      }}
                      className="w-full max-w-md px-4 py-2.5 rounded-xl border border-purple-200 text-xs bg-white font-bold text-purple-900 focus:ring-2 focus:ring-purple-200"
                    >
                      {productNameOptions.map((fab) => (
                        <option key={fab} value={fab}>{fab}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Default Short Description for &quot;{selectedDescFabric}&quot;:</label>
                      <textarea
                        rows={2}
                        value={customShortDesc}
                        onChange={(e) => setCustomShortDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Default Full Detailed Description for &quot;{selectedDescFabric}&quot;:</label>
                      <textarea
                        rows={3}
                        value={customFullDesc}
                        onChange={(e) => setCustomFullDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveFabricDescription}
                      className="px-6 py-2.5 bg-purple-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-purple-800 shadow-sm"
                    >
                      💾 Save Default Descriptions for {selectedDescFabric}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Catalog Products List Tab */}
          {activeTab === 'manage' && (() => {
            // Filter products based on search term (SKU, name, category, work)
            const filteredProducts = products.filter(p => {
              const term = catalogSearchTerm.toLowerCase().trim()
              if (!term) return true
              return (
                p.name.toLowerCase().includes(term) ||
                p.sku.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                (p.specifications?.work && p.specifications.work.toLowerCase().includes(term))
              )
            })

            const totalPages = Math.ceil(filteredProducts.length / catalogItemsPerPage) || 1
            const validPage = Math.min(catalogCurrentPage, totalPages)
            const startIndex = (validPage - 1) * catalogItemsPerPage
            const paginatedProducts = filteredProducts.slice(startIndex, startIndex + catalogItemsPerPage)

            return (
              <div className="space-y-6">
                {/* Controls Header: Search, Page Size Selector & Stats */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                      <input
                        type="text"
                        placeholder="Search SKU, name, category..."
                        value={catalogSearchTerm}
                        onChange={(e) => {
                          setCatalogSearchTerm(e.target.value)
                          setCatalogCurrentPage(1)
                        }}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50"
                      />
                      <Package className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Show per page:</span>
                      <select
                        value={catalogItemsPerPage}
                        onChange={(e) => {
                          setCatalogItemsPerPage(Number(e.target.value))
                          setCatalogCurrentPage(1)
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold text-gray-800"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="text-gray-500 font-mono">
                      Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + catalogItemsPerPage, filteredProducts.length)} of {filteredProducts.length} items
                    </div>
                  </div>
                </div>

                  {loading ? (
                    <div className="text-center py-12 text-sm text-gray-500">Loading catalog items...</div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 p-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-gray-800 text-base mb-1">No Matching Products Found</p>
                      <p className="text-xs text-gray-500">Try adjusting your search criteria or add new products.</p>
                    </div>
                  ) : (
                    /* Amazon-Style Single Item Per Row List View */
                    <div className="space-y-4">
                      {paginatedProducts.map((p) => {
                        // Extract main display image (stitched front/back or first fabric photo)
                        const rawDisplayImage = p.images?.find(img => img && img !== '/images/logo.svg') || '/images/logo.svg'
                        const cleanDisplayImage = rawDisplayImage.replace(/^stitched_front:/, '').replace(/^stitched_back:/, '')

                        return (
                          <div
                            key={p.id}
                            className={`bg-white p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                              p.available ? 'border-gray-200' : 'border-red-200 bg-red-50/20'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                              
                              {/* Left Section: Thumbnail & Main Info (Amazon List Layout) */}
                              <div className="flex items-start gap-4 flex-grow min-w-0">
                                {/* Product Thumbnail */}
                                <div className="w-20 h-24 rounded-xl border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden relative group shadow-xs">
                                  {/* Color indicator stripe */}
                                  <div
                                    className="absolute top-0 left-0 right-0 h-1.5 z-10"
                                    style={{ backgroundColor: p.specifications?.hexColor || '#C4204F' }}
                                  />
                                  <img
                                    src={cleanDisplayImage}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {/* Text Details & Metadata */}
                                <div className="space-y-1.5 min-w-0 flex-grow">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                        SKU: {p.sku ? p.sku.replace(/^RGB-/, '') : ''}
                                      </span>
                                      <h3 className="font-heading font-bold text-gray-900 text-base hover:text-primary transition-colors">
                                      {p.name}
                                    </h3>
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                      p.available ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                      {p.available ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                                    <span className="font-bold text-gray-900 text-sm">{p.priceDisplay}</span>
                                    <span>•</span>
                                    <span className="capitalize font-semibold text-gray-700">Category: <strong>{p.category}</strong></span>
                                    <span>•</span>
                                    <span className="text-gray-500">Color: <strong className="text-gray-800">{p.specifications?.color}</strong></span>
                                    <span>•</span>
                                    <span className="text-gray-500">Work: <strong className="text-gray-800">{p.specifications?.work}</strong></span>
                                    <span>•</span>
                                    <span className="text-gray-500">Cut: <strong className="text-gray-800">{p.specifications?.cutLength}</strong></span>
                                  </div>

                                  {/* Quick Image Badges/Links */}
                                  {p.images && p.images.filter(img => img && img !== '/images/logo.svg').length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                      {p.images.filter(img => img && img !== '/images/logo.svg').map((rawImgUrl, i) => {
                                        const isFrontStitched = rawImgUrl.startsWith('stitched_front:') || rawImgUrl.includes('stitched-front')
                                        const isBackStitched = rawImgUrl.startsWith('stitched_back:') || rawImgUrl.includes('stitched-back')
                                        const cleanUrl = rawImgUrl.replace(/^stitched_front:/, '').replace(/^stitched_back:/, '')

                                        const rawFabricPhotos = p.images.filter(img => img && !img.startsWith('stitched_front:') && !img.startsWith('stitched_back:') && !img.includes('stitched-front') && !img.includes('stitched-back'))
                                        const rawFabricIdx = rawFabricPhotos.indexOf(rawImgUrl)
                                        const rawFabricLabels = ['Front Fabric Photo', 'Back Fabric Photo', 'Sleeve/Hand Fabric Photo']

                                        const labelText = isFrontStitched ? '✨ Front Render' : isBackStitched ? '✨ Back Render' : (rawFabricLabels[rawFabricIdx] || `Fabric Photo #${rawFabricIdx + 1}`)

                                        const numericSku = p.sku ? p.sku.replace(/^RGB-/, '') : 'sku'
                                        const fileNameText = `sku-${numericSku}-${labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`

                                        return (
                                          <div
                                            key={i}
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] ${
                                              isFrontStitched || isBackStitched ? 'bg-purple-50 border-purple-200 text-purple-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                                            }`}
                                          >
                                            <a
                                              href={cleanUrl}
                                              download={fileNameText}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 hover:underline text-primary"
                                            >
                                              <Download className="w-3 h-3" />
                                              <span>{labelText}</span>
                                            </a>
                                            {(!isFrontStitched && !isBackStitched || userRole === 'superadmin') && (
                                              <button
                                                onClick={() => handleRemoveSingleImageFromProduct(p, i)}
                                                className="ml-1 text-gray-400 hover:text-red-600 p-0.5 rounded hover:bg-red-50"
                                                title={`Remove ${labelText}`}
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Section: Actions & Super Admin Upload Form */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-shrink-0">
                                {/* Super Admin Attach Render Box */}
                                {userRole === 'superadmin' && (
                                  <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200 flex flex-col gap-2 w-full sm:w-64">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                                      <span className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-purple-600" />
                                        <span>Upload Renders</span>
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <label className="flex items-center justify-center gap-1 p-1.5 bg-white border border-dashed border-purple-300 rounded text-[10px] cursor-pointer hover:bg-purple-100/50 truncate">
                                        <Upload className="w-3 h-3 text-purple-600 flex-shrink-0" />
                                        <span className="truncate">{productRenders[p.id]?.frontName || 'Front'}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleProductRenderFrontUpload(p.id, e.target.files?.[0])}
                                          className="hidden"
                                        />
                                      </label>
                                      <label className="flex items-center justify-center gap-1 p-1.5 bg-white border border-dashed border-purple-300 rounded text-[10px] cursor-pointer hover:bg-purple-100/50 truncate">
                                        <Upload className="w-3 h-3 text-purple-600 flex-shrink-0" />
                                        <span className="truncate">{productRenders[p.id]?.backName || 'Back'}</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleProductRenderBackUpload(p.id, e.target.files?.[0])}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                    <button
                                      onClick={() => handleUploadBlouseRendersForProduct(p)}
                                      className="py-1 bg-purple-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-purple-700"
                                    >
                                      Save Renders
                                    </button>
                                  </div>
                                )}

                                {/* Admin Action Buttons */}
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => handleStartEditProduct(p)}
                                    className="px-3 py-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                                    title="Edit Product Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => handleToggleStock(p.id, p.available)}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                                      p.available
                                        ? 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    }`}
                                    title="Toggle Availability"
                                  >
                                    {p.available ? 'Mark Out of Stock' : 'Mark Available'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Pagination Navigation Footer */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 bg-white p-4 rounded-2xl shadow-xs">
                      <button
                        onClick={() => setCatalogCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={validPage === 1}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                      >
                        ← Previous Page
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => setCatalogCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                              pageNum === validPage
                                ? 'bg-primary text-white shadow-xs scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCatalogCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={validPage === totalPages}
                        className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                      >
                        Next Page →
                      </button>
                    </div>
                  )}

                </div>
              )
            })()}

        </div>
      </main>

      <Footer />
    </div>
  )
}
