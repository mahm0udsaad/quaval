import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { ringspannCatalogs } from "@/config/catalogs"

type RingspannCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function RingspannCatalogsPage({ params }: RingspannCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="RINGSPANN power-transmission catalogs"
      introduction="Browse two RINGSPANN publications covering freewheels, backstops, overrunning clutches, indexing freewheels, and shaft-hub connections, including application, selection, and dimensional data."
      catalogs={ringspannCatalogs}
    />
  )
}
