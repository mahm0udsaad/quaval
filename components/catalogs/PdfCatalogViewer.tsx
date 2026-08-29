"use client"

import { ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import type { PdfCatalog } from "@/config/catalogs"

type PdfCatalogViewerProps = {
  catalogs: PdfCatalog[]
}

type PdfRenderTask = {
  cancel: () => void
  promise: Promise<void>
}

type PdfPage = {
  getViewport: ({ scale }: { scale: number }) => { width: number; height: number }
  render: (options: {
    canvas: HTMLCanvasElement
    canvasContext: CanvasRenderingContext2D
    viewport: { width: number; height: number }
  }) => PdfRenderTask
}

type PdfDocument = {
  numPages: number
  getPage: (pageNumber: number) => Promise<PdfPage>
  destroy: () => Promise<void>
}

type PdfLoadingTask = {
  promise: Promise<PdfDocument>
  destroy: () => Promise<void>
}

const zoomLevels = [100, 125, 150, 175] as const

export default function PdfCatalogViewer({ catalogs }: PdfCatalogViewerProps) {
  const [catalogId, setCatalogId] = useState(catalogs[0]?.id ?? "")
  const [page, setPage] = useState(1)
  const [zoomIndex, setZoomIndex] = useState(0)
  const [pdfDocument, setPdfDocument] = useState<PdfDocument | null>(null)
  const [isLoadingDocument, setIsLoadingDocument] = useState(true)
  const [isRenderingPage, setIsRenderingPage] = useState(false)
  const [error, setError] = useState("")
  const [renderVersion, setRenderVersion] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const documentTasksRef = useRef<Map<string, PdfLoadingTask>>(new Map())

  const catalog = useMemo(
    () => catalogs.find((item) => item.id === catalogId) ?? catalogs[0],
    [catalogId, catalogs],
  )

  useEffect(() => {
    const preventSaveOrPrint = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && ["p", "s"].includes(event.key.toLowerCase())) {
        event.preventDefault()
      }
    }

    window.addEventListener("keydown", preventSaveOrPrint)
    return () => window.removeEventListener("keydown", preventSaveOrPrint)
  }, [])

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => setRenderVersion((version) => version + 1), 120)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!catalog) return

    let active = true

    setPdfDocument(null)
    setIsLoadingDocument(true)
    setError("")

    const loadDocument = async () => {
      try {
        const pdfjs = await import("pdfjs-dist/webpack.mjs")
        let loadingTask = documentTasksRef.current.get(catalog.sourceUrl)

        if (!loadingTask) {
          loadingTask = pdfjs.getDocument({
            url: catalog.sourceUrl,
            rangeChunkSize: 262144,
            cMapUrl: "/pdfjs/cmaps/",
            cMapPacked: true,
            iccUrl: "/pdfjs/iccs/",
            standardFontDataUrl: "/pdfjs/standard_fonts/",
            wasmUrl: "/pdfjs/wasm/",
          }) as unknown as PdfLoadingTask
          documentTasksRef.current.set(catalog.sourceUrl, loadingTask)
        }

        const document = await loadingTask.promise
        if (!active) return

        setPdfDocument(document)
      } catch (loadError) {
        documentTasksRef.current.delete(catalog.sourceUrl)
        if (!active) return
        console.error("Unable to load catalog PDF", loadError)
        setError("This catalog could not be loaded. Please try again.")
      } finally {
        if (active) setIsLoadingDocument(false)
      }
    }

    void loadDocument()

    return () => {
      active = false
    }
  }, [catalog])

  useEffect(
    () => () => {
      const loadingTasks = Array.from(documentTasksRef.current.values())
      documentTasksRef.current.clear()

      for (const loadingTask of loadingTasks) {
        void loadingTask.destroy().catch(() => undefined)
      }
    },
    [],
  )

  useEffect(() => {
    if (!catalog || !pdfDocument || !canvasRef.current || !pageRef.current) return

    let active = true
    let renderTask: PdfRenderTask | null = null

    const renderPage = async () => {
      setIsRenderingPage(true)

      try {
        const pdfPage = await pdfDocument.getPage(page)
        if (!active || !canvasRef.current || !pageRef.current) return

        const baseViewport = pdfPage.getViewport({ scale: 1 })
        const displayWidth = pageRef.current.clientWidth
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        const renderWidth = Math.min(displayWidth * pixelRatio, 2400)
        const viewport = pdfPage.getViewport({ scale: renderWidth / baseViewport.width })
        const canvas = canvasRef.current
        const context = canvas.getContext("2d", { alpha: false })

        if (!context) throw new Error("Canvas rendering is unavailable")

        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.style.width = "100%"
        canvas.style.height = "auto"

        renderTask = pdfPage.render({ canvas, canvasContext: context, viewport })
        await renderTask.promise

        for (const nearbyPage of [page - 1, page + 1]) {
          if (nearbyPage >= 1 && nearbyPage <= pdfDocument.numPages) {
            void pdfDocument.getPage(nearbyPage)
          }
        }
      } catch (renderError) {
        if (!active || (renderError as { name?: string }).name === "RenderingCancelledException") {
          return
        }
        console.error("Unable to render catalog page", renderError)
        setError("This page could not be rendered. Please try again.")
      } finally {
        if (active) setIsRenderingPage(false)
      }
    }

    void renderPage()

    return () => {
      active = false
      renderTask?.cancel()
    }
  }, [catalog, page, pdfDocument, renderVersion, zoomIndex])

  if (!catalog) return null

  const zoom = zoomLevels[zoomIndex]
  const pageCount = pdfDocument?.numPages ?? catalog.pageCount

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
  }

  const selectCatalog = (nextCatalogId: string) => {
    setPdfDocument(null)
    setIsLoadingDocument(true)
    setError("")
    setPage(1)
    setZoomIndex(0)
    setCatalogId(nextCatalogId)
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
              onClick={() => selectCatalog(item.id)}
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
              onClick={() => setZoomIndex((current) => Math.min(current + 1, zoomLevels.length - 1))}
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
            ref={pageRef}
            className="relative mx-auto min-h-96 overflow-hidden rounded-lg bg-white shadow-xl select-none"
            style={{ width: `${zoom}%`, minWidth: zoom === 100 ? "100%" : undefined }}
          >
            <canvas
              ref={canvasRef}
              aria-label={`${catalog.title}, page ${page} of ${pageCount}`}
              className="block h-auto w-full pointer-events-none"
            />

            {(isLoadingDocument || isRenderingPage) && !error ? (
              <div className="absolute inset-0 flex min-h-96 items-center justify-center bg-white/90 text-sm font-medium text-text-light">
                {isLoadingDocument ? "Loading catalog…" : `Rendering page ${page}…`}
              </div>
            ) : null}

            {error ? (
              <div className="flex min-h-96 items-center justify-center px-6 text-center text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

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
              disabled={page === 1 || isLoadingDocument}
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
                max={pageCount}
                value={page}
                disabled={isLoadingDocument}
                onChange={(event) => goToPage(Number(event.target.value) || 1)}
                className="w-16 rounded-lg border border-black/15 bg-white px-2 py-2 text-center text-text outline-none focus:border-primary disabled:opacity-60"
              />
              <span>of {pageCount}</span>
            </label>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === pageCount || isLoadingDocument}
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
