import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { fyhCatalogs } from "@/config/catalogs"

type FyhCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function FyhCatalogsPage({ params }: FyhCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="FYH mounted bearing units catalog"
      introduction="Browse the FYH publication selected by Quaval, covering ball-bearing inserts, pillow and flange housings, take-up and cartridge units, stainless and thermoplastic series, selection guidance, load data, and product dimensions."
      catalogs={fyhCatalogs}
    />
  )
}
