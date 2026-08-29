import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { gmnCatalogs } from "@/config/catalogs"

type GmnCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function GmnCatalogsPage({ params }: GmnCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="GMN high-precision bearing catalog"
      introduction="Browse GMN's high-precision ball-bearing publication covering spindle and deep-groove bearings, materials, selection and engineering guidance, lubrication, calculations, and dimensions."
      catalogs={gmnCatalogs}
    />
  )
}
