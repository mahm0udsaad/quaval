import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { kbcCatalogs } from "@/config/catalogs"

type KbcCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function KbcCatalogsPage({ params }: KbcCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="KBC full line bearing catalog"
      introduction="Browse KBC's ball, roller, thrust, unit, water-pump, clutch, ceramic, and vacuum bearing ranges with selection guidance, engineering data, dimensions, and load ratings."
      catalogs={kbcCatalogs}
    />
  )
}
