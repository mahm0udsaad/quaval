import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { carterCatalogs } from "@/config/catalogs"

type CarterCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function CarterCatalogsPage({ params }: CarterCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Carter bearing products catalog"
      introduction="Browse Carter's cam followers, yoke rollers, custom and stainless bearings, Hi-Rollers, Neverlube products, and engineering resources."
      catalogs={carterCatalogs}
    />
  )
}
