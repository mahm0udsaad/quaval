import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { schneebergerCatalogs } from "@/config/catalogs"

type SchneebergerCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function SchneebergerCatalogsPage({
  params,
}: SchneebergerCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="SCHNEEBERGER technical catalogs"
      introduction="Browse five SCHNEEBERGER publications selected by Quaval, covering miniature linear motion, integrated measuring systems, gear racks, precision slides, and mineral casting."
      catalogs={schneebergerCatalogs}
    />
  )
}
