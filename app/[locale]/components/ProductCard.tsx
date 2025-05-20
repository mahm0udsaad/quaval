import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Dimension {
  bore?: string
  width?: string
  weight?: string
  outerDiameter?: string
}

interface LoadRating {
  static?: string
  dynamic?: string
}

interface TechnicalFeature {
  Bore?: string
  Seal?: string
  Speed?: string
  "Cage Type"?: string
  Precision?: string
  Lubrication?: string
  [key: string]: string | undefined
}

interface Product {
  id: string
  part_number?: string
  part_numbers?: string[]
  name?: string
  family_name?: string
  price?: number
  description?: string
  images?: string[]
  stock_status?: string
  dimensions?: Dimension
  load_ratings?: LoadRating
  technical_features?: TechnicalFeature
  specifications?: Record<string, any>
}

export function ProductCard({ product }: { product: Product }) {
  // Extract key specifications from the product data
  const dimensions = product.dimensions || {}
  const loadRatings = product.load_ratings || {}
  const technicalFeatures = product.technical_features || {}

  // Determine which specifications to display
  const keySpecs = [
    { label: "Bore", value: dimensions.bore || technicalFeatures.Bore },
    { label: "Outer Ø", value: dimensions.outerDiameter },
    { label: "Width", value: dimensions.width },
    { label: "Dynamic Load", value: loadRatings.dynamic },
    { label: "Speed", value: technicalFeatures.Speed },
    { label: "Seal Type", value: technicalFeatures.Seal },
  ].filter((spec) => spec.value)

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <Image
          src={(product.images && product.images[0]) || "/placeholder.svg"}
          alt={product.name || "Product"}
          width={300}
          height={300}
          className="w-full h-64 object-contain"
        />
        {product.stock_status && (
          <Badge
            className={`absolute top-2 right-2 ${
              product.stock_status.toLowerCase().includes("in stock") ? "bg-green-500" : "bg-amber-500"
            }`}
          >
            {product.stock_status}
          </Badge>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          {(product.part_numbers && product.part_numbers[0]) || product.part_number || "Unnamed Product"}
          {product.part_numbers && product.part_numbers.length > 1 && (
            <div className="text-sm font-medium text-gray-500 mt-1">
              +{product.part_numbers.length - 1} more part numbers
            </div>
          )}
        </h2>

        <div className="text-sm text-gray-600 mb-2">{product.name || product.family_name || ""}</div>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description || "No description available"}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold">${(product.price || 0).toFixed(2)}</span>
          <Link
            href={`/products/${product.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            View Details
          </Link>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Key Specifications:</h3>
          <div className="grid grid-cols-2 gap-2">
            {keySpecs.slice(0, 4).map((spec, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                <span className="text-xs font-medium text-gray-500">{spec.label}</span>
                <p className="text-sm font-medium">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {keySpecs.length > 4 && (
          <div className="text-xs text-gray-600 space-y-1">
            {keySpecs.slice(4).map((spec, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">{spec.label}:</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
