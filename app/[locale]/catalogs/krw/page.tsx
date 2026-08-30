import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { krwCatalogs } from "@/config/catalogs"

type KrwCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function KrwCatalogsPage({ params }: KrwCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="KRW bearings delivery programme"
      introduction="Browse KRW's rolling-bearing ranges, product dimensions, technical guidance, accessories, application data, and reference information."
      catalogs={krwCatalogs}
    />
  )
}
