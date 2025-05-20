"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProducts, type Product } from "@/lib/api"
import { useCountry } from "../contexts/CountryContext"
import { useTranslate } from "@/lib/i18n-client"

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCountry } = useCountry()
  const { t } = useTranslate()

  useEffect(() => {
    if (selectedCountry) {
      fetchFeaturedProducts()
    }
  }, [selectedCountry])

  const fetchFeaturedProducts = async () => {
    setIsLoading(true)
    try {
      const products = await getProducts(selectedCountry ?? undefined)
      // Get up to 3 products for the featured section
      setFeaturedProducts(products.slice(0, 3))
    } catch (error) {
      console.error("Error fetching featured products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-24 animate-fade-in">
      <div className="container mx-auto px-4">
        <h2 className="section-title">{t('home.featuredProducts')}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card">
                <div className="relative h-64 bg-gray-100 animate-pulse"></div>
                <div className="p-6 space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('products.noProductsAvailable')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.part_number}
                    fill
                    className="object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">{product.part_number}</h3>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-primary hover:text-primary-dark transition duration-300 inline-flex items-center font-medium"
                  >
                    {t('general.viewDetails')}
                    <ArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
