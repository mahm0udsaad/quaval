"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import type { Catalog } from "@/config/catalogs"

type CatalogViewerProps = {
  catalogs: Catalog[]
}

const zoomLevels = [100, 125, 150, 175] as const

const pagePath = (catalog: Catalog, page: number) =>
  `${catalog.pageDirectory}/page-${String(page).padStart(2, "0")}.jpg`

export default function CatalogViewer({ catalogs }: CatalogViewerProps) {
  const [catalogId, setCatalogId] = useState(catalogs[0]?.id ?? "")
  const [page, setPage] = useState(1)
  const [zoomIndex, setZoomIndex] = useState(0)

  const catalog = useMemo(
    () => catalogs.find((item) => item.id === catalogId) ?? catalogs[0],
    [catalogId, catalogs],
  )

  useEffect(() => {
    setPage(1)
    setZoomIndex(0)
  }, [catalogId])

  useEffect(() => {
    if (!catalog) return

    const nearbyPages = [page - 1, page + 1].filter(
      (candidate) => candidate >= 1 && candidate <= catalog.pageCount,
    )

    nearbyPages.forEach((candidate) => {
      const image = new window.Image()
      image.src = pagePath(catalog, candidate)
    })
  }, [catalog, page])

  useEffect(() => {
    const preventSaveOrPrint = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && ["p", "s"].includes(event.key.toLowerCase())) {
        event.preventDefault()
      }
    }

    window.addEventListener("keydown", preventSaveOrPrint)
    return () => window.removeEventListener("keydown", preventSaveOrPrint)
  }, [])

  if (!catalog) return null

  const zoom = zoomLevels[zoomIndex]

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), catalog.pageCount))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {catalogs.map((item) => {
          const selected = item.id === catalog.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCatalogId(item.id)}
              aria-pressed={selected}
              className={`cursor-pointer rounded-2xl border p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                selected
                  ? "border-primary bg-white shadow-sm"
                  : "border-black/10 bg-white hover:border-primary hover:bg-background"
              }`}
            >
              <span className="block text-lg font-semibold text-secondary">{item.shortTitle}</span>
              <span className="mt-1 block text-sm text-text-light">{item.pageCount} pages</span>
            </button>
          )
        })}
      </div>

      <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-black/10 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary sm:text-2xl">{catalog.title}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-text-light">{catalog.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2" aria-label="Catalog controls">
            <button
              type="button"
              onClick={() => setZoomIndex((current) => Math.max(current - 1, 0))}
              disabled={zoomIndex === 0}
              className="cursor-pointer rounded-lg border border-black/15 p-2 text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-14 text-center text-sm font-medium text-text">{zoom}%</span>
            <button
              type="button"
              onClick={() =>
                setZoomIndex((current) => Math.min(current + 1, zoomLevels.length - 1))
              }
              disabled={zoomIndex === zoomLevels.length - 1}
              className="cursor-pointer rounded-lg border border-black/15 p-2 text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="max-h-[78vh] overflow-auto bg-background p-2 sm:p-4"
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        >
          <div
            className="relative mx-auto overflow-hidden rounded-lg bg-white shadow-xl select-none"
            style={{ width: `${zoom}%`, minWidth: zoom === 100 ? "100%" : undefined }}
          >
            <Image
              key={`${catalog.id}-${page}`}
              src={pagePath(catalog, page)}
              alt={`${catalog.title}, page ${page} of ${catalog.pageCount}`}
              width={1754}
              height={1241}
              priority
              draggable={false}
              className="h-auto w-full pointer-events-none"
              sizes="(max-width: 1024px) 100vw, 1280px"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              <span className="-rotate-12 whitespace-nowrap rounded-full border border-secondary px-8 py-3 text-2xl font-bold tracking-[0.35em] text-secondary opacity-10 sm:text-4xl">
                QUAVAL · VIEW ONLY
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-sm text-text-light">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Online reference copy — direct PDF download is not provided.</span>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/15 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <label className="flex items-center gap-2 text-sm text-text">
              <span className="sr-only">Current page</span>
              <input
                type="number"
                min={1}
                max={catalog.pageCount}
                value={page}
                onChange={(event) => goToPage(Number(event.target.value) || 1)}
                className="w-16 rounded-lg border border-black/15 bg-white px-2 py-2 text-center text-text outline-none focus:border-primary"
              />
              <span>of {catalog.pageCount}</span>
            </label>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === catalog.pageCount}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-black/15 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
