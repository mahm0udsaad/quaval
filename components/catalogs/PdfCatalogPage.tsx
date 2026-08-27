import Link from "next/link"
import { ArrowLeft, Eye, FileStack } from "lucide-react"

import type { PdfCatalog } from "@/config/catalogs"

import PdfCatalogViewer from "./PdfCatalogViewer"

type PdfCatalogPageProps = {
  locale: string
  heading: string
  introduction: string
  catalogs: PdfCatalog[]
}

export default function PdfCatalogPage({
  locale,
  heading,
  introduction,
  catalogs,
}: PdfCatalogPageProps) {
  const pageCount = catalogs.reduce((total, catalog) => total + catalog.pageCount, 0)

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href={`/${locale}/catalogs`}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-light transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Catalogs & certificates
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Eye className="h-3.5 w-3.5" />
              Online viewing
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
              {heading}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-text-light sm:text-lg">
              {introduction}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-sm">
            <FileStack className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold text-secondary">{pageCount.toLocaleString("en")}</div>
              <div className="text-sm text-text-light">pages available</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <PdfCatalogViewer catalogs={catalogs} />
        </div>
      </div>
    </div>
  )
}
