import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { smithCatalogs } from "@/config/catalogs"

type SmithCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function SmithCatalogsPage({ params }: SmithCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Smith Bearing product catalog"
      introduction="Browse Smith Bearing's industrial and aerospace cam followers, needle bearings, track rollers, guide rails, stainless products, and special assemblies."
      catalogs={smithCatalogs}
    />
  )
}
