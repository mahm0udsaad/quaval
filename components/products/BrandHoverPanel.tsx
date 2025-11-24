"use client"

import Link from "next/link"
import { useState } from "react"
import ProductHoverImage, { type ProductFamilyWithImage } from "./ProductHoverImage"

export type BrandWithFamilies = {
  name: string
  slug: string
  families: ProductFamilyWithImage[]
}

interface BrandHoverPanelProps {
  brand: BrandWithFamilies
  locale: string
}

function toFamilySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function BrandHoverPanel({ brand, locale }: BrandHoverPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const families = brand.families ?? []
  const activeFamily = families[activeIndex] ?? families[0]

  return (
    <div className="flex w-full lg:w-2/3 bg-white">
      <div className="w-2/3 p-3 lg:p-4 grid grid-cols-1 md:grid-cols-2 gap-1.5 lg:gap-2">
        {families.map((family, index) => {
          const familySlug = toFamilySlug(family.name)
          const href = `/${locale}/products/${brand.slug}?family=${encodeURIComponent(familySlug)}`

          return (
            <Link
              key={familySlug}
              href={href}
              className={`rounded-md px-2.5 py-2 text-xs lg:text-sm text-secondary hover:bg-primary/5 hover:text-primary transition ${
                index === activeIndex ? "bg-primary/5 text-primary" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {family.name}
            </Link>
          )
        })}
      </div>
      <div className="hidden md:block w-1/3 border-s border-gray-100">
        <ProductHoverImage brandName={brand.name} family={activeFamily} />
      </div>
    </div>
  )
}


