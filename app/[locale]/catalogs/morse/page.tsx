import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { morseCatalogs } from "@/config/catalogs"

type MorseCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function MorseCatalogsPage({ params }: MorseCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Morse cam-clutch catalog"
      introduction="Browse the Morse KK cam-clutch product specification guide, including operating ratings, dimensional data, mounting guidance, and application information."
      catalogs={morseCatalogs}
    />
  )
}
