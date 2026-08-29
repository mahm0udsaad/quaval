import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { nadellaCatalogs } from "@/config/catalogs"

type NadellaCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function NadellaCatalogsPage({ params }: NadellaCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Nadella bearing catalogs"
      introduction="Browse two Nadella publications selected by Quaval, covering needle bearings, cam followers and track rollers, product variants, selection guidance, load data, and dimensions."
      catalogs={nadellaCatalogs}
    />
  )
}
