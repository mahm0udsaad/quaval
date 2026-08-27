import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { kinexCatalogs } from "@/config/catalogs"

type KinexCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function KinexCatalogsPage({ params }: KinexCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="KINEX technical catalog"
      introduction="Browse the KINEX rolling-bearing catalog selected by Quaval, including engineering guidance, product ranges, dimensions, and load data."
      catalogs={kinexCatalogs}
    />
  )
}
