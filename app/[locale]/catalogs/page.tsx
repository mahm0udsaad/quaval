import Link from "next/link"
import { ArrowRight, BookOpen, FileCheck2, LockKeyhole } from "lucide-react"

type CatalogsPageProps = {
  params: Promise<{ locale: string }>
}

const upcomingCatalogs = ["NTN", "SNR", "KSM", "DKF", "KINEX", "TIMKEN", "STC-STEYR", "JIB"]
const upcomingCertificates = ["KSM", "NTN", "QUAVAL", "DKF", "STC-STEYR"]

export default async function CatalogsPage({ params }: CatalogsPageProps) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-background text-text">
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <LockKeyhole className="h-3.5 w-3.5" />
            Protected document library
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-secondary sm:text-5xl lg:text-6xl">
            Catalogs & certificates
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-text-light sm:text-lg">
            Browse technical publications and distribution documents online. Source PDF files
            are not offered for direct download.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section aria-labelledby="catalogs-heading">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <h2 id="catalogs-heading" className="text-2xl font-bold text-secondary sm:text-3xl">
              Product catalogs
            </h2>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`/${locale}/catalogs/quaval`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background md:col-span-2"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">QUAVAL</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Roller bearings and deep groove ball bearings — 64 technical pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {upcomingCatalogs.map((brand) => (
              <div
                key={brand}
                className="flex min-h-48 flex-col justify-between rounded-3xl border border-black/10 bg-white p-7"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-light">
                    File pending
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-secondary">{brand}</h3>
                </div>
                <p className="mt-6 text-sm text-text-light">Catalog will appear when supplied.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="certificates-heading">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-7 w-7 text-primary" />
            <h2 id="certificates-heading" className="text-2xl font-bold text-secondary sm:text-3xl">
              Distribution certificates
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-text-light">
            Certificates will be added here as protected online documents after each original
            file is verified.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {upcomingCertificates.map((brand) => (
              <div key={brand} className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="font-semibold text-secondary">{brand}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-text-light">
                  File pending
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
