"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getProducts } from "@/lib/api"
import { useCountry } from "@/app/[locale]/contexts/CountryContext"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/app/[locale]/components/ProductCard"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { selectedCountry } = useCountry()

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const data = await getProducts(selectedCountry || undefined)
        setProducts(data || []) // Add fallback to empty array
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts([]) // Set to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [selectedCountry])

  return (
    <div>
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src="https://quaval.ca/images/home/slider/03.jpg"
          alt="Quaval Bearings Products"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-xl text-gray-200">
              Discover our range of high-quality industrial bearings available in your region
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600">No products found for your region</h2>
            <p className="mt-2 text-gray-500">
              Please select a different region or contact us for specific product inquiries.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
