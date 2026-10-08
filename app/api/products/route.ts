import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/types'
import { verifyAdminSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const dataFilePath = path.join(process.cwd(), 'data', 'products.json')

function getProductsFromFile(): Product[] {
  try {
    if (!fs.existsSync(dataFilePath)) return []
    const fileData = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(fileData || '[]')
  } catch {
    return []
  }
}

// Convert DB row format to Product model
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    category: row.category,
    price: Number(row.price),
    priceDisplay: row.price_display || `₹${Number(row.price).toLocaleString('en-IN')}`,
    showPrice: row.show_price ?? true,
    images: Array.isArray(row.images) ? row.images : ['/images/logo.svg'],
    description: typeof row.description === 'object' && row.description !== null ? row.description : { short: '', full: '' },
    specifications: typeof row.specifications === 'object' && row.specifications !== null ? row.specifications : { fabric: '', color: '', work: '', care: '', occasion: '' },
    features: Array.isArray(row.features) ? row.features : [],
    available: row.available ?? true,
    featured: row.featured ?? false,
    isBestseller: row.is_bestseller ?? false,
    isNewCollection: row.is_new_collection ?? false,
    tags: Array.isArray(row.tags) ? row.tags : [],
    relatedProducts: []
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      // Fallback to local file if Supabase table is empty or error occurs
      const localProducts = getProductsFromFile()
      return NextResponse.json(localProducts)
    }

    const products = data.map(mapRowToProduct)
    return NextResponse.json(products)
  } catch {
    const localProducts = getProductsFromFile()
    return NextResponse.json(localProducts)
  }
}

export async function POST(request: Request) {
  const session = verifyAdminSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Determine SKU number
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const totalCount = (count || 0) + 1
    const generatedSku = totalCount.toString().padStart(3, '0')

    const newProductId = `blouse-${Date.now()}`
    const productData = {
      id: newProductId,
      name: body.name || 'Untitled Blouse Fabric',
      slug: (body.name || 'blouse').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: generatedSku,
      category: body.category || 'Bridal',
      price: Number(body.price) || 0,
      price_display: `₹${Number(body.price || 0).toLocaleString('en-IN')}`,
      show_price: true,
      images: body.images && body.images.length > 0 ? body.images : ['/images/logo.svg'],
      description: {
        short: body.shortDescription || '',
        full: body.fullDescription || ''
      },
      specifications: {
        fabric: body.fabric || 'Netted Tissue Fabric',
        color: body.colorName || 'Custom Color',
        hexColor: body.hexColor || '#C4204F',
        cutLength: body.cutLength || '1.0 Meter (Unstitched)',
        work: body.work || 'Gold Zari (Hand work)',
        care: body.care || 'Dry clean only',
        occasion: body.occasion || 'Festive, Wedding'
      },
      features: body.features || ['Pure Quality Fabric', 'Unstitched Cut Piece'],
      available: body.available ?? true,
      featured: body.featured ?? false,
      is_bestseller: body.isBestseller ?? false,
      is_new_collection: body.isNewCollection ?? false,
      tags: body.tags || [body.category || 'Bridal']
    }

    const { data, error } = await supabase.from('products').insert([productData]).select().single()

    if (error) {
      console.error('Supabase product insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: mapRowToProduct(data) })
  } catch (error) {
    console.error('POST Product error:', error)
    return NextResponse.json({ error: 'Invalid product payload' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const session = verifyAdminSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Fetch existing product
    const { data: existing } = await supabase.from('products').select('*').eq('id', id).single()

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updatedPrice = body.price !== undefined ? Number(body.price) : Number(existing.price)
    const updatedSpecs = existing.specifications || {}

    if (body.fabric !== undefined) updatedSpecs.fabric = body.fabric
    if (body.cutLength !== undefined) updatedSpecs.cutLength = body.cutLength
    if (body.work !== undefined) updatedSpecs.work = body.work
    if (body.colorName !== undefined) updatedSpecs.color = body.colorName
    if (body.hexColor !== undefined) updatedSpecs.hexColor = body.hexColor

    const updatedDesc = existing.description || {}
    if (body.shortDescription !== undefined) updatedDesc.short = body.shortDescription
    if (body.fullDescription !== undefined) updatedDesc.full = body.fullDescription

    const updatePayload: any = {}
    if (body.name !== undefined) updatePayload.name = body.name
    if (body.price !== undefined) {
      updatePayload.price = updatedPrice
      updatePayload.price_display = `₹${updatedPrice.toLocaleString('en-IN')}`
    }
    if (body.category !== undefined) updatePayload.category = body.category
    if (body.available !== undefined) updatePayload.available = body.available
    if (body.featured !== undefined) updatePayload.featured = body.featured
    if (body.isBestseller !== undefined) updatePayload.is_bestseller = body.isBestseller
    if (body.isNewCollection !== undefined) updatePayload.is_new_collection = body.isNewCollection
    if (body.images !== undefined && Array.isArray(body.images)) updatePayload.images = body.images
    updatePayload.specifications = updatedSpecs
    updatePayload.description = updatedDesc

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: mapRowToProduct(data) })
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = verifyAdminSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
