import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { mcgillCatalogs } from "@/config/catalogs"

type McgillCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function McgillCatalogsPage({ params }: McgillCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="McGill cam follower bearings catalog"
      introduction="Browse the McGill cam follower publication selected by Quaval, including CAMROL ranges, yoke rollers, inch and metric dimensions, load ratings, product selection, and engineering guidance."
      catalogs={mcgillCatalogs}
    />
  )
}
