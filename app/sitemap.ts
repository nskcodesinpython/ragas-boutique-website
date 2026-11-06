import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ragasboutique.in'

  // Core static marketing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/address`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic product detail routes from Supabase
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('available', true)

    if (products && products.length > 0) {
      const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
        url: `${baseUrl}/product/${prod.id}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
      return [...staticRoutes, ...productRoutes]
    }
  } catch (error) {
    console.error('Error fetching sitemap products:', error)
  }

  return staticRoutes
}

