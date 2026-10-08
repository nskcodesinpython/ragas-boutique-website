import { Product } from '@/types'
import productsData from '@/data/products.json'

const products = productsData as unknown as Product[]

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return products
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

/**
 * Get product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

/**
 * Get related products
 */
export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId)
  if (!product || !product.relatedProducts) return []

  return product.relatedProducts
    .map((id: string) => getProductById(id))
    .filter((p): p is Product => p !== undefined)
}

/**
 * Search products by query
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter((product) =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.short.toLowerCase().includes(lowerQuery) ||
    product.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  )
}
