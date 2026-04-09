"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { type Banner, getBanners } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslate } from "@/lib/i18n-client"

export default function HomeCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { locale } = useTranslate()

  useEffect(() => {
    fetchBanners()
  }, [locale])

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [banners])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const data = await getBanners(locale)
      setBanners(data)
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (isLoading) {
    return (
      <div className="relative h-[600px] bg-gray-200">
        <div className="container mx-auto px-16 h-full flex items-center">
          <div className="max-w-2xl">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[600px] bg-secondary">
        <div className="container mx-auto px-16 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Quaval Bearings</h1>
            <p className="text-xl mb-8">Premium quality industrial bearings</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {banners.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <div className="container mx-auto px-16 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-4">{item.title}</h1>
                <p className="text-xl mb-8">{item.description}</p>
                <Link
                  href={item.button_link}
                  className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-md hover:bg-gray-100 transition duration-300 font-semibold text-lg"
                >
                  {item.button_text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button onClick={prevSlide} className="bg-white/80 p-2 rounded-full hover:bg-white transition duration-300">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="bg-white/80 p-2 rounded-full hover:bg-white transition duration-300">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition duration-300 ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
