import { NextRequest, NextResponse } from "next/server"

const catalogSources: Record<string, string> = {
  skf: "https://www.quaval.ca/downloads/SKF_EN.pdf",
  "stc-steyr": "/catalog-documents/stc-steyr/source.bin",
  jib: "/catalog-documents/jib/source.bin",
}

type CatalogRouteContext = {
  params: Promise<{ catalog: string }>
}

async function proxyCatalog(request: NextRequest, { params }: CatalogRouteContext) {
  const { catalog } = await params
  const configuredSource = catalogSources[catalog]

  if (!configuredSource) {
    return NextResponse.json({ error: "Catalog not found" }, { status: 404 })
  }

  const sourceUrl = configuredSource.startsWith("/")
    ? new URL(configuredSource, request.nextUrl.origin).toString()
    : configuredSource

  const range = request.headers.get("range")
  const upstreamHeaders = new Headers()
  if (range) upstreamHeaders.set("range", range)

  const upstream = await fetch(sourceUrl, {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers: upstreamHeaders,
    cache: "no-store",
  })

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Catalog source unavailable" }, { status: 502 })
  }

  const responseHeaders = new Headers({
    "Accept-Ranges": upstream.headers.get("accept-ranges") ?? "bytes",
    "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    "Content-Disposition": "inline",
    "Content-Type": "application/pdf",
    "X-Content-Type-Options": "nosniff",
  })

  for (const header of ["content-length", "content-range", "etag", "last-modified"]) {
    const value = upstream.headers.get(header)
    if (value) responseHeaders.set(header, value)
  }

  return new NextResponse(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxyCatalog
export const HEAD = proxyCatalog
