import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { rollwayCatalogs } from "@/config/catalogs"

type RollwayCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function RollwayCatalogsPage({ params }: RollwayCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Rollway general bearing catalog"
      introduction="Browse Rollway's general catalog covering ball and roller bearing ranges, accessories, designation guidance, load and speed data, engineering information, and dimensions."
      catalogs={rollwayCatalogs}
    />
  )
}
