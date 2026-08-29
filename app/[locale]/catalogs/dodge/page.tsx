import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { dodgeCatalogs } from "@/config/catalogs"

type DodgeCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function DodgeCatalogsPage({ params }: DodgeCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Dodge bearing engineering catalog"
      introduction="Browse the Dodge bearing engineering catalog selected by Quaval, including mounted roller bearings, hydrodynamic bearings, plain and journal bearings, take-up frames, and technical selection data."
      catalogs={dodgeCatalogs}
    />
  )
}
