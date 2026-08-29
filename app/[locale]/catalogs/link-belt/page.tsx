import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { linkBeltCatalogs } from "@/config/catalogs"

type LinkBeltCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function LinkBeltCatalogsPage({ params }: LinkBeltCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Link-Belt & Rex bearing catalog"
      introduction="Browse the Link-Belt and Rex bearing publication selected by Quaval, covering mounted spherical roller bearings, ball and sleeve bearings, cylindrical roller bearings, dimensions, selection guidance, and engineering data."
      catalogs={linkBeltCatalogs}
    />
  )
}
