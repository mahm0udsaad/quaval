import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { ntnCatalogs } from "@/config/catalogs"

type NtnCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function NtnCatalogsPage({ params }: NtnCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="NTN technical catalog"
      introduction="Browse the NTN ball and roller bearing catalog supplied by Quaval, including selection guidance, bearing ranges, dimensions, and load data."
      catalogs={ntnCatalogs}
    />
  )
}
