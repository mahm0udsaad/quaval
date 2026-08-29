import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { stieberCatalogs } from "@/config/catalogs"

type StieberCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function StieberCatalogsPage({ params }: StieberCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Stieber clutch and backstop catalog"
      introduction="Browse Stieber's product publication covering overrunning clutches and backstops, operating principles, application guidance, technical data, and dimensions."
      catalogs={stieberCatalogs}
    />
  )
}
