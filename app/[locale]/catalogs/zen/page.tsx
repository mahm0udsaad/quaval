import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { zenCatalogs } from "@/config/catalogs"

type ZenCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function ZenCatalogsPage({ params }: ZenCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="ZEN standard catalogue"
      introduction="Browse ZEN's standard catalog covering ball and roller bearing ranges, materials, seals, lubrication, tolerances, engineering guidance, load data, and dimensions."
      catalogs={zenCatalogs}
    />
  )
}
