import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { kashimaCatalogs } from "@/config/catalogs"

type KashimaCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function KashimaCatalogsPage({ params }: KashimaCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Kashima bearing catalogs"
      introduction="Browse three Kashima publications selected by Quaval, covering plastic bushings and plain bearings, low-maintenance self-aligning pillow blocks, and UKB ball bearings for special environments."
      catalogs={kashimaCatalogs}
    />
  )
}
