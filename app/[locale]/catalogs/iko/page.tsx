import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { ikoCatalogs } from "@/config/catalogs"

type IkoCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function IkoCatalogsPage({ params }: IkoCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="IKO dimension and interchange catalog"
      introduction="Browse IKO dimensional and interchange references selected by Quaval, covering needle roller bearings, cam and roller followers, linear-motion products, related series, and engineering conversion data."
      catalogs={ikoCatalogs}
    />
  )
}
