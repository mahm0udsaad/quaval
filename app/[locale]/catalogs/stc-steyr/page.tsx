import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { stcSteyrCatalogs } from "@/config/catalogs"

type StcSteyrCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function StcSteyrCatalogsPage({ params }: StcSteyrCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="STC-STEYR technical catalog"
      introduction="Browse the STC-STEYR rolling-bearing delivery programme supplied by Quaval, including product ranges, dimensions, and technical tables."
      catalogs={stcSteyrCatalogs}
    />
  )
}
