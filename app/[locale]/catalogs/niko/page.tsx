import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { nikoCatalogs } from "@/config/catalogs"

type NikoCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function NikoCatalogsPage({ params }: NikoCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="NIKO product catalogs"
      introduction="Browse NIKO's technical catalogs covering linear and roller guideways, ground ball screws, precision shafts, selection guidance, performance data, and dimensions."
      catalogs={nikoCatalogs}
    />
  )
}
