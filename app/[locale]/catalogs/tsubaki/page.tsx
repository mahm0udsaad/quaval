import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { tsubakiCatalogs } from "@/config/catalogs"

type TsubakiCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function TsubakiCatalogsPage({ params }: TsubakiCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Tsubaki general catalog"
      introduction="Browse Tsubaki's general catalog covering drive and conveyor chains, sprockets, power-transmission components, selection guidance, engineering data, and dimensions."
      catalogs={tsubakiCatalogs}
    />
  )
}
