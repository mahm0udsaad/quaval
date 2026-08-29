import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { fsqCatalogs } from "@/config/catalogs"

type FsqCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function FsqCatalogsPage({ params }: FsqCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="FSQ bearing catalogs"
      introduction="Browse two FSQ publications selected by Quaval, covering split bearing housings, accessories, sleeves, pillow block bearing units, dimensions, and load data."
      catalogs={fsqCatalogs}
    />
  )
}
