import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { ozakCatalogs } from "@/config/catalogs"

type OzakCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function OzakCatalogsPage({ params }: OzakCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="OZAK linear bearings catalog"
      introduction="Browse the OZAK publication selected by Quaval, covering linear bearings and guides, ball screws, support units, actuators, selection guidance, performance data, and product dimensions."
      catalogs={ozakCatalogs}
    />
  )
}
