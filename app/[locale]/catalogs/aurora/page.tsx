import PdfCatalogPage from "@/components/catalogs/PdfCatalogPage"
import { auroraCatalogs } from "@/config/catalogs"

type AuroraCatalogsPageProps = {
  params: Promise<{ locale: string }>
}

export default async function AuroraCatalogsPage({ params }: AuroraCatalogsPageProps) {
  const { locale } = await params

  return (
    <PdfCatalogPage
      locale={locale}
      heading="Aurora rod end and spherical bearing catalog"
      introduction="Browse Aurora's commercial, military, and aircraft rod ends, spherical bearings, accessories, engineering data, and technical resources."
      catalogs={auroraCatalogs}
    />
  )
}
