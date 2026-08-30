import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { sealmasterCatalogs } from "@/config/catalogs"

type SealmasterCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function SealmasterCatalogsPage({ params }: SealmasterCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Sealmaster bearing products catalog"
      introduction="Browse Sealmaster's catalog covering mounted ball and roller bearings, rod ends, spherical bearings, application solutions, engineering guidance, and dimensions."
      catalogs={sealmasterCatalogs}
    />
  )
}
