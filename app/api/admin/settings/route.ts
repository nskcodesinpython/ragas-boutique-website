import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifyAdminSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const settingsFilePath = path.join(process.cwd(), 'data', 'admin-settings.json')

const DEFAULT_SETTINGS = {
  productNames: [
    'Netted Tissue Fabric',
    'Semi silk fabric',
    'Tissue fabric'
  ],
  categories: [
    'Bridal',
    'Semi Bridal',
    'Casual'
  ],
  craftWorks: [
    'Gold Zari (Hand work)',
    'Silver Zari (Hand work)',
    'Beadwork (Hand work)',
    'Embroidary (Machine)'
  ],
  descriptions: {
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
  }
}

function getSettingsFromFile() {
  try {
    if (!fs.existsSync(settingsFilePath)) return DEFAULT_SETTINGS
    const fileData = fs.readFileSync(settingsFilePath, 'utf8')
    return JSON.parse(fileData || JSON.stringify(DEFAULT_SETTINGS))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('settings')
      .eq('id', 1)
      .single()

    if (error || !data || !data.settings) {
      const local = getSettingsFromFile()
      return NextResponse.json(local)
    }

    return NextResponse.json(data.settings)
  } catch {
    const local = getSettingsFromFile()
    return NextResponse.json(local)
  }
}

export async function POST(request: Request) {
  const session = verifyAdminSession()
  if (!session.authenticated || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized. Superadmin session required.' }, { status: 403 })
  }

  try {
    const body = await request.json()

    // Fetch current setting
    const { data: currentData } = await supabase
      .from('admin_settings')
      .select('settings')
      .eq('id', 1)
      .single()

    const current = currentData?.settings || getSettingsFromFile()

    const updatedSettings = {
      productNames: Array.isArray(body.productNames) ? body.productNames : current.productNames,
      categories: Array.isArray(body.categories) ? body.categories : current.categories,
      craftWorks: Array.isArray(body.craftWorks) ? body.craftWorks : current.craftWorks,
      descriptions: body.descriptions || current.descriptions
    }

    const { error } = await supabase
      .from('admin_settings')
      .upsert({ id: 1, settings: updatedSettings, updated_at: new Date().toISOString() })

    if (error) {
      console.error('Supabase settings upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error('POST Admin Settings error:', error)
    return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
  }
}
