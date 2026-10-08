import * as colorDiff from 'color-diff'

export interface RGBColor {
  R: number
  G: number
  B: number
}

/**
 * Convert Hex String (#RRGGBB) to RGB object
 */
export function hexToRgb(hex: string): RGBColor {
  let cleanHex = hex.replace('#', '')
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('')
  }
  const num = parseInt(cleanHex, 16)
  return {
    R: (num >> 16) & 255,
    G: (num >> 8) & 255,
    B: num & 255
  }
}

/**
 * Calculate CIE76 color distance between target hex and a palette hex color
 */
export function getColorDistance(hex1: string, hex2: string): number {
  try {
    const rgb1 = hexToRgb(hex1)
    const rgb2 = hexToRgb(hex2)
    
    const lab1 = colorDiff.rgb_to_lab(rgb1)
    const lab2 = colorDiff.rgb_to_lab(rgb2)

    return colorDiff.diff(lab1, lab2)
  } catch {
    return 9999
  }
}

/**
 * Automatically determine human-readable color name from any Hex Color
 */
export function getColorNameFromHex(hex: string): string {
  const colorNames: { [key: string]: string } = {
    '#FF0000': 'Red',
    '#C4204F': 'Crimson Pink',
    '#800020': 'Royal Maroon',
    '#C9A96E': 'Champagne Gold',
    '#002D62': 'Royal Blue',
    '#046307': 'Emerald Green',
    '#E27D9B': 'Pastel Pink',
    '#E5A000': 'Mustard Gold',
    '#1A1A1A': 'Charcoal Black',
    '#FFFFFF': 'Pure White',
    '#800080': 'Purple',
    '#FFA500': 'Orange',
    '#40E0D0': 'Turquoise Teal',
    '#808080': 'Grey'
  }

  let closestName = 'Custom Shade'
  let minDistance = Infinity

  for (const [paletteHex, name] of Object.entries(colorNames)) {
    const dist = getColorDistance(hex, paletteHex)
    if (dist < minDistance) {
      minDistance = dist
      closestName = name
    }
  }

  return closestName
}

/**
 * Sort products array by closest matching hex color distance
 */
export function sortByClosestColor<T extends { specifications?: { hexColor?: string } }>(
  products: T[],
  targetHex: string
): T[] {
  if (!targetHex) return products

  return [...products].sort((a, b) => {
    const hexA = a.specifications?.hexColor || '#808080'
    const hexB = b.specifications?.hexColor || '#808080'

    const distA = getColorDistance(targetHex, hexA)
    const distB = getColorDistance(targetHex, hexB)

    return distA - distB
  })
}
