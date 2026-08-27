import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { ksmCatalogs } from "@/config/catalogs"

type KsmCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function KsmCatalogsPage({ params }: KsmCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="KSM technical catalog"
      introduction="Browse the complete KSM bearing catalog supplied by Quaval, including ball, roller, linear, heavy-duty, housing, and bearing-unit ranges."
      catalogs={ksmCatalogs}
    />
  )
}
