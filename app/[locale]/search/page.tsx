"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SearchAutocomplete } from "@/app/[locale]/components/search-autocomplete"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { searchProducts } from "@/app/[locale]/actions/search"
import type { Product } from "@/lib/api"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState<Product[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!query) {
      setProducts([])
      return
    }

    startTransition(async () => {
      try {
        const result = await searchProducts(query)
        setProducts(result.products || [])
      } catch (error) {
        console.error("Error fetching search results:", error)
        setProducts([])
      }
    })
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="mb-8 max-w-xl">
        <SearchAutocomplete className="w-full" placeholder="Refine your search..." />
      </div>

      {isPending ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading results...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.part_number || product.name || "Product"}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No image available</div>
                )}
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {product.part_number ||
                    (product.part_numbers && product.part_numbers[0]) ||
                    product.name ||
                    "Unnamed product"}
                </h2>
                {product.family_name && (
                  <Badge variant="outline" className="mb-2">
                    {product.family_name}
                  </Badge>
                )}
                <div className="mt-4">
                  <Link href={`/products/${product.id}`} className="text-primary hover:underline font-medium">
                    View Product
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600 mb-6">We couldn't find any products matching "{query}"</p>
          <Link href="/products" className="text-primary hover:underline font-medium">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  )
}
