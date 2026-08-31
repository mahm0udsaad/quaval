import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { rbcCatalogs } from "@/config/catalogs"

type RbcCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function RbcCatalogsPage({ params }: RbcCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="RBC bearing catalogs"
      introduction="Browse RBC thrust bearing solutions, cam followers, and spherical plain bearings with product data, lubrication options, and application guidance."
      catalogs={rbcCatalogs}
    />
  )
}
