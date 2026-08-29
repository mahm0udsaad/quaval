import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { hiwinCatalogs } from "@/config/catalogs"

type HiwinCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function HiwinCatalogsPage({ params }: HiwinCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="HIWIN motion catalogs"
      introduction="Browse two HIWIN technical publications selected by Quaval, covering linear guideways and ballscrews with engineering principles, selection guidance, accuracy and preload data, product series, accessories, and dimensions."
      catalogs={hiwinCatalogs}
    />
  )
}
