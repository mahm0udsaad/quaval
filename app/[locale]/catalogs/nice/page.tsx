import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { niceCatalogs } from "@/config/catalogs"

type NiceCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function NiceCatalogsPage({ params }: NiceCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="NICE precision products and solutions"
      introduction="Browse NICE precision, semi-ground, and unground ball bearings alongside RBC cam followers, roller bearings, rod ends, self-lubricating bearings, and custom solutions."
      catalogs={niceCatalogs}
    />
  )
}
