"use client"

import { useState } from "react"
import { useTranslate } from "@/lib/i18n-client"
import BrandHoverPanel, { type BrandWithFamilies } from "./BrandHoverPanel"
import brandsConfig from "@/config/brands.json"

type BrandsConfig = {
  brands: BrandWithFamilies[]
}

interface MegaMenuProps {
  locale: string
}

const BRANDS = (brandsConfig as BrandsConfig).brands

export default function MegaMenu({ locale }: MegaMenuProps) {
  const { t } = useTranslate()
  const [activeBrandSlug, setActiveBrandSlug] = useState<string>(BRANDS[0]?.slug ?? "")

  const activeBrand = BRANDS.find((b) => b.slug === activeBrandSlug) ?? BRANDS[0]

  return (
    <div className="flex w-[900px] max-w-[90vw] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 rtl:flex-row-reverse">
      <div className="w-1/3 bg-gray-50 border-e border-gray-100">
        <div className="px-4 pt-3 pb-2">
          <p className="text-xs font-medium text-gray-500">
            {t("navigation.brands") ?? "Brands"}
          </p>
        </div>
        <ul className="max-h-[420px] overflow-y-auto">
          {BRANDS.map((brand) => (
            <li key={brand.slug}>
              <button
                type="button"
                onMouseEnter={() => setActiveBrandSlug(brand.slug)}
                className={`w-full text-start px-4 py-2.5 text-sm transition flex items-center justify-between ${
                  brand.slug === activeBrandSlug
                    ? "bg-white text-primary font-semibold"
                    : "text-secondary hover:bg-white/70"
                }`}
              >
                <span>{brand.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3">
        {activeBrand && <BrandHoverPanel brand={activeBrand} locale={locale} />}
      </div>
    </div>
  )
}


