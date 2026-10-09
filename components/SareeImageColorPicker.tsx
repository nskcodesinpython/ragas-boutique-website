'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, Camera, Pipette, X, Sparkles, Check, RefreshCw } from 'lucide-react'

interface SareeImageColorPickerProps {
  onSelectColor: (hexColor: string) => void
  onClose?: () => void
}

export function SareeImageColorPicker({ onSelectColor, onClose }: SareeImageColorPickerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [dominantColors, setDominantColors] = useState<string[]>([])
  const [selectedHex, setSelectedHex] = useState<string>('#C4204F')
  const [loupePosition, setLoupePosition] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Draw image on canvas and extract dominant colors when image loads
  useEffect(() => {
    if (!imageSrc) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = imageSrc
    img.onload = () => {
      imageRef.current = img
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas internal dimensions matching image aspect ratio
      const maxWidth = 500
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Auto extract top 3 dominant colors
      extractDominantColors(ctx, canvas.width, canvas.height)
    }
  }, [imageSrc])

  const extractDominantColors = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imageData = ctx.getImageData(0, 0, width, height).data
      const colorCounts: Record<string, number> = {}

      // Sample every 10th pixel for performance
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]
        const a = imageData[i + 3]

        if (a < 128) continue // Ignore transparent pixels

        // Quantize colors slightly to group similar tones
        const qR = Math.round(r / 32) * 32
        const qG = Math.round(g / 32) * 32
        const qB = Math.round(b / 32) * 32

        const hex = `#${((1 << 24) + (qR << 16) + (qG << 8) + qB).toString(16).slice(1).toUpperCase()}`
        colorCounts[hex] = (colorCounts[hex] || 0) + 1
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])

      const top3 = sorted.slice(0, 3)
      if (top3.length > 0) {
        setDominantColors(top3)
        setSelectedHex(top3[0])
      }
    } catch (e) {
      console.error('Error extracting colors:', e)
    }
  }

  // Pick pixel color from Canvas touch/mouse position
  const pickColorFromCanvas = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((clientY - rect.top) * (canvas.height / rect.height))

    if (x >= 0 && y >= 0 && x < canvas.width && y < canvas.height) {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const pixel = ctx.getImageData(x, y, 1, 1).data
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`

      setSelectedHex(hex)
      setLoupePosition({ x: clientX - rect.left, y: clientY - rect.top, show: true })
    }
  }

  const handleApplyColor = (hex: string) => {
    onSelectColor(hex)
    if (onClose) onClose()
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl max-w-xl w-full mx-auto space-y-6">
      
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900">Upload Saree Photo</h3>
            <p className="text-xs text-gray-500">Pick or tap any color on your saree to search matching blouses</p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!imageSrc ? (
        /* Image Upload Box */
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-2xl bg-[#FAF8F5] cursor-pointer hover:bg-primary/5 transition-all text-center space-y-3">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-primary">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <span className="font-heading font-bold text-gray-900 text-sm block">Take Photo with Camera or Pick Saree Image</span>
            <span className="text-xs text-gray-500">Supports direct camera photo or gallery selection</span>
          </div>
        </label>
      ) : (
        /* Image Canvas & Eyedropper */
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 flex justify-center items-center">
            <canvas
              ref={canvasRef}
              onClick={(e) => pickColorFromCanvas(e.clientX, e.clientY)}
              onTouchStart={(e) => {
                const touch = e.touches[0]
                if (touch) pickColorFromCanvas(touch.clientX, touch.clientY)
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0]
                if (touch) pickColorFromCanvas(touch.clientX, touch.clientY)
              }}
              className="max-w-full max-h-[350px] object-contain cursor-crosshair touch-none"
            />

            {/* Tap Instruction Overlay */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
              <Pipette className="w-3 h-3 text-secondary-light" />
              <span>Tap anywhere to pick color</span>
            </div>
          </div>

          {/* Auto Extracted Dominant Colors Palette */}
          {dominantColors.length > 0 && (
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Auto Extracted Saree Palette:
              </span>
              <div className="flex items-center gap-3">
                {dominantColors.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHex(hex)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      selectedHex === hex
                        ? 'border-primary ring-2 ring-primary/20 bg-white shadow-sm'
                        : 'border-gray-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: hex }} />
                    <span>{hex}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Color Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl border-2 border-gray-200 shadow-md" style={{ backgroundColor: selectedHex }} />
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Selected Color</span>
                <span className="text-sm font-mono font-extrabold text-gray-900">{selectedHex}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setImageSrc(null)}
                className="p-2.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-upload</span>
              </button>

              <button
                onClick={() => handleApplyColor(selectedHex)}
                className="btn-primary text-xs px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Find Matching Blouses</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

