'use client'

import React, { useState } from 'react'
import { RotateCw, Sparkles, Layers } from 'lucide-react'

interface BlouseVisualizerProps {
  frontImage?: string
  backImage?: string
  colorHex?: string
  fabricName?: string
  className?: string
}

export function Blouse2DVisualizer({
  frontImage,
  backImage,
  colorHex = '#C4204F',
  fabricName = 'Blouse Fabric',
  className = ''
}: BlouseVisualizerProps) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front')

  const currentImage = activeSide === 'front' ? frontImage : backImage

  return (
    <div className={`relative bg-gradient-to-b from-gray-50 to-amber-50/20 rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col items-center justify-between p-6 ${className}`}>
      {/* 2D Cutout SVG Mask Container */}
      <div className="relative w-full aspect-[4/4] max-w-sm flex items-center justify-center my-2">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-xl transition-all duration-500"
        >
          <defs>
            {/* SVG Clip Path Mask for Front Blouse Silhouette */}
            <clipPath id="blouse-front-cutout">
              {/* Traditional Front Neckline & Sleeves Silhouette */}
              <path d="M 90 60 C 110 95, 190 95, 210 60 L 260 95 L 235 150 L 210 135 L 210 230 C 210 240, 90 240, 90 230 L 90 135 L 65 150 L 40 95 Z" />
            </clipPath>

            {/* SVG Clip Path Mask for Back Blouse Silhouette */}
            <clipPath id="blouse-back-cutout">
              {/* Deep Back Neckline & Dori Ties Silhouette */}
              <path d="M 90 60 C 120 160, 180 160, 210 60 L 260 95 L 235 150 L 210 135 L 210 230 C 210 240, 90 240, 90 230 L 90 135 L 65 150 L 40 95 Z" />
            </clipPath>
          </defs>

          {/* Background Solid Swatches / Fallback Pattern */}
          <rect
            x="0"
            y="0"
            width="300"
            height="300"
            fill={colorHex}
            clipPath={activeSide === 'front' ? 'url(#blouse-front-cutout)' : 'url(#blouse-back-cutout)'}
            className="transition-colors duration-300"
          />

          {/* Fabric Texture Image Overlay (if uploaded) */}
          {currentImage && currentImage !== '/images/logo.svg' && (
            <image
              href={currentImage}
              x="0"
              y="0"
              width="300"
              height="300"
              preserveAspectRatio="xMidYMid slice"
              clipPath={activeSide === 'front' ? 'url(#blouse-front-cutout)' : 'url(#blouse-back-cutout)'}
              className="opacity-95"
            />
          )}

          {/* 2D Contour Highlights & Stitching Lines Outline */}
          {activeSide === 'front' ? (
            <g fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" strokeDasharray="4 3">
              {/* Front Neckline Border */}
              <path d="M 90 60 C 110 95, 190 95, 210 60" />
              {/* Sleeve Seams */}
              <path d="M 90 60 L 90 135" />
              <path d="M 210 60 L 210 135" />
              {/* Waist Band Stitch line */}
              <path d="M 90 215 L 210 215" />
              {/* Outer Boundary line */}
              <path
                d="M 90 60 C 110 95, 190 95, 210 60 L 260 95 L 235 150 L 210 135 L 210 230 C 210 240, 90 240, 90 230 L 90 135 L 65 150 L 40 95 Z"
                stroke="rgba(0,0,0,0.25)"
                strokeDasharray="none"
                strokeWidth="2"
              />
            </g>
          ) : (
            <g fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2.5" strokeDasharray="4 3">
              {/* Deep Back Neckline Border */}
              <path d="M 90 60 C 120 160, 180 160, 210 60" />
              {/* Dori Tie Line at Back */}
              <path d="M 105 85 C 150 110, 150 110, 195 85" stroke="#C9A96E" strokeWidth="3" strokeDasharray="none" />
              {/* Latkan Tassels */}
              <circle cx="150" cy="115" r="4" fill="#C9A96E" />
              {/* Waist Band */}
              <path d="M 90 215 L 210 215" />
              {/* Outer Boundary */}
              <path
                d="M 90 60 C 120 160, 180 160, 210 60 L 260 95 L 235 150 L 210 135 L 210 230 C 210 240, 90 240, 90 230 L 90 135 L 65 150 L 40 95 Z"
                stroke="rgba(0,0,0,0.25)"
                strokeDasharray="none"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* 2D Badge Indicator */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>2D Blouse Preview ({activeSide.toUpperCase()})</span>
        </div>
      </div>

      {/* Interactive Toggle Control (Front vs Back) */}
      <div className="w-full flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Layers className="w-4 h-4 text-primary" />
          <span>View Side:</span>
        </div>

        <div className="flex items-center bg-gray-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSide === 'front'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Front View
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSide === 'back'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Back View
          </button>
        </div>
      </div>
    </div>
  )
}

