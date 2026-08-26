"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/api"
import { useTranslate } from "@/lib/i18n-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FinderQuery = {
  bore: number
  outerDiameter: number
  width: number
  bearingType: string
}

type ProductBearingFinderProps = {
  products: Product[]
}

function parseDimension(value?: string) {
  if (!value) return null

  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""))
  return Number.isFinite(parsed) ? parsed : null
}

function dimensionsMatch(actual: string | undefined, requested: number) {
  const parsed = parseDimension(actual)
  return parsed !== null && Math.abs(parsed - requested) < 0.001
}

export default function ProductBearingFinder({ products }: ProductBearingFinderProps) {
  const { locale } = useTranslate()
  const [bore, setBore] = useState("")
  const [outerDiameter, setOuterDiameter] = useState("")
  const [width, setWidth] = useState("")
  const [bearingType, setBearingType] = useState("")
  const [query, setQuery] = useState<FinderQuery | null>(null)

  const bearingTypes = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.family_name).filter(Boolean) as string[])).sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  )

  const matches = useMemo(() => {
    if (!query) return []

    return products.filter(
      (product) =>
        product.family_name === query.bearingType &&
        dimensionsMatch(product.dimensions?.bore, query.bore) &&
        dimensionsMatch(product.dimensions?.outerDiameter, query.outerDiameter) &&
        dimensionsMatch(product.dimensions?.width, query.width),
    )
  }, [products, query])

  const canSearch = Boolean(bore && outerDiameter && width && bearingType)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSearch) return

    setQuery({
      bore: Number.parseFloat(bore),
      outerDiameter: Number.parseFloat(outerDiameter),
      width: Number.parseFloat(width),
      bearingType,
    })
  }

  return (
    <Card className="mb-12 overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-secondary to-primary text-white">
        <CardTitle className="text-2xl">Identify Your Bearing</CardTitle>
        <p className="text-sm text-white/85">
          Enter the dimensions in millimetres and select the bearing type to find the matching bearing number and brand.
        </p>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="finder-bore">Bore (mm)</Label>
            <Input
              id="finder-bore"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={bore}
              onChange={(event) => setBore(event.target.value)}
              placeholder="25"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="finder-outer-diameter">Outer diameter (mm)</Label>
            <Input
              id="finder-outer-diameter"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={outerDiameter}
              onChange={(event) => setOuterDiameter(event.target.value)}
              placeholder="52"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="finder-width">Width (mm)</Label>
            <Input
              id="finder-width"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={width}
              onChange={(event) => setWidth(event.target.value)}
              placeholder="15"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Bearing type</Label>
            <Select value={bearingType} onValueChange={setBearingType} required>
              <SelectTrigger aria-label="Bearing type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {bearingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" size="lg" disabled={!canSearch}>
            Calculate Bearing
          </Button>
        </form>

        {query ? (
          <div className="mt-8" aria-live="polite">
            {matches.length > 0 ? (
              <div className="space-y-3">
                <p className="font-semibold text-secondary">
                  {matches.length === 1 ? "Matching bearing" : `${matches.length} matching bearings`}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {matches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${locale}/products/${product.id}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-primary hover:bg-primary/5"
                    >
                      <span className="block text-lg font-bold text-secondary">{product.part_number}</span>
                      <span className="mt-1 block text-sm text-primary">{product.family_brand}</span>
                      <span className="mt-1 block text-xs text-gray-500">{product.family_name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                No exact match was found. Please verify the dimensions or contact Quaval for technical identification support.
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
