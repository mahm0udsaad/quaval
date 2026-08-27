import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { jibCatalogs } from "@/config/catalogs"

type JibCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function JibCatalogsPage({ params }: JibCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="JIB technical catalog"
      introduction="Browse the JIB ball-bearing-unit catalog supplied by Quaval, including technical guidance, unit selection, housings, and dimensional tables."
      catalogs={jibCatalogs}
    />
  )
}
