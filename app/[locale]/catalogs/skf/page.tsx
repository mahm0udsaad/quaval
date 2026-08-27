import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { skfCatalogs } from "@/config/catalogs"

type SkfCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function SkfCatalogsPage({ params }: SkfCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="SKF technical catalog"
      introduction="Browse the SKF rolling-bearing publication selected by Quaval. Use the page and zoom controls to examine technical guidance and bearing tables online."
      catalogs={skfCatalogs}
    />
  )
}
