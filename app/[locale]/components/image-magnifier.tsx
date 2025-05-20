"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ZoomIn, ZoomOut } from "lucide-react"

interface ImageMagnifierProps {
  src: string
  alt: string
  width?: number
  height?: number
  zoomLevel?: number
}

export function ImageMagnifier({ src, alt, width = 400, height = 400, zoomLevel = 1.5 }: ImageMagnifierProps) {
  const [isZoomActive, setIsZoomActive] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (isZoomActive) {
      // Only activate hover zoom if zoom mode is active
      document.body.style.cursor = "zoom-in"
    }
  }

  const handleMouseLeave = () => {
    document.body.style.cursor = "default"
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomActive) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()

    // Calculate mouse position as percentage of container dimensions
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setMousePosition({ x, y })
  }

  const toggleZoom = () => {
    setIsZoomActive(!isZoomActive)
  }

  // Handle touch events for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomActive || e.touches.length === 0) return

    const touch = e.touches[0]
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()

    // Calculate touch position as percentage of container dimensions
    const x = ((touch.clientX - left) / width) * 100
    const y = ((touch.clientY - top) / height) * 100

    setMousePosition({ x, y })
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        ref={imageContainerRef}
        className="relative overflow-hidden w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px] md:max-w-[400px] md:max-h-[400px] lg:max-w-[450px] lg:max-h-[450px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className={`object-contain p-2 sm:p-4 transition-transform duration-200 ${isZoomActive ? "scale-[1.5]" : "scale-100"}`}
          style={{
            transformOrigin: isZoomActive ? `${mousePosition.x}% ${mousePosition.y}%` : "center center",
          }}
          sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, 450px"
        />
      </div>

      <button
        onClick={toggleZoom}
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white rounded-full p-1.5 sm:p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
        aria-label={isZoomActive ? "Disable zoom" : "Enable zoom"}
      >
        {isZoomActive ? (
          <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        ) : (
          <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
        )}
      </button>
    </div>
  )
}
