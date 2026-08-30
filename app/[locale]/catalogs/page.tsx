import Link from "next/link"
import { ArrowRight, BookOpen, FileCheck2, LockKeyhole } from "lucide-react"

type CatalogsPageProps = {
  params: Promise<{ locale: string }>
}

const upcomingCatalogs = ["SNR", "DKF"]
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
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
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

            <Link
              href={`/${locale}/catalogs/timken`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">TIMKEN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Four technical publications covering tapered, spherical, AP/AP-2, and mounted
                  bearing applications — 950 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/skf`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">SKF</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Rolling-bearing selection, engineering guidance, dimensions, and load ratings
                  — 1,152 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/stc-steyr`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">STC-STEYR</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Rolling-bearing delivery programme, dimensions, designations, and technical
                  tables — 250 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/jib`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">JIB</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Ball bearing units, housings, technical selection guidance, and dimensional
                  tables — 141 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/ksm`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">KSM</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Ball, roller, linear, heavy-duty, housing, and bearing-unit product ranges —
                  451 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/ntn`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">NTN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Ball and roller bearing ranges, selection guidance, dimensions, and load data
                  — 411 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/kinex`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">KINEX</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Rolling-bearing ranges, accessories, engineering guidance, dimensions, and
                  load data — 311 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/schneeberger`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">SCHNEEBERGER</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Five catalogs covering miniature linear motion, gear racks, slides, and mineral
                  casting — 195 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/dodge`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">DODGE</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Mounted, hydrodynamic, plain, and journal bearing engineering, selection, and
                  dimensional data — 756 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/mcgill`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">McGILL</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Cam followers, yoke rollers, inch and metric ranges, selection guidance, and
                  engineering data — 156 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/link-belt`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">LINK-BELT & REX</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Mounted roller and ball bearings, sleeve bearings, selection guidance,
                  dimensions, and engineering data — 544 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/fsq`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">FSQ</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Two catalogs covering bearing housings, accessories, pillow blocks, dimensions,
                  and load data — 141 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/iko`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">IKO</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Dimension and interchange references for needle bearings, followers,
                  linear-motion products, and related series — 172 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/kashima`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">KASHIMA</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Three catalogs covering plastic plain bearings, low-maintenance pillow blocks,
                  and UKB ball bearings — 36 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/ozak`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">OZAK</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Linear bearings, guides, ball screws, support units, actuators, selection data,
                  and dimensions — 456 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/fyh`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">FYH</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Mounted bearing inserts and housings, special-material series, selection
                  guidance, load data, and dimensions — 224 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/hiwin`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">HIWIN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Two technical catalogs covering linear guideways and ballscrews, including
                  selection, engineering, accessories, and dimensions — 465 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/nadella`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">NADELLA</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Two catalogs covering needle bearings, cam followers, track rollers, load data,
                  selection guidance, and dimensions — 251 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/stieber`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">STIEBER</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Overrunning clutches and backstops, selection guidance, applications, technical
                  data, and dimensions — 96 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/morse`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">MORSE</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  KK cam-clutch specifications, operating ratings, dimensions, mounting
                  guidance, and applications — 6 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/gmn`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">GMN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  High-precision spindle and deep-groove ball bearings, engineering guidance,
                  lubrication, calculations, and dimensions — 100 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/ringspann`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">RINGSPANN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Two catalogs covering freewheels, clutches, backstops, and shaft-hub
                  connections, with selection data and dimensions — 224 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/rollway`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">ROLLWAY</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Ball and roller bearing ranges, accessories, engineering information, load
                  data, and dimensions — 169 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/zen`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">ZEN</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Ball and roller bearing ranges, materials, tolerances, engineering guidance,
                  load data, and dimensions — 153 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/tsubaki`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">TSUBAKI</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Drive and conveyor chains, sprockets, power-transmission components, selection
                  guidance, and engineering data — 362 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/niko`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">NIKO</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Six catalogs covering linear and roller guideways, ball screws, and precision
                  shafts — 150 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalogs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href={`/${locale}/catalogs/sealmaster`}
              className="group flex min-h-64 flex-col justify-between rounded-3xl border-2 border-primary bg-white p-8 shadow-sm transition-colors hover:bg-background"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Available now
                </div>
                <h3 className="mt-4 text-3xl font-bold text-secondary">SEALMASTER</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-text-light">
                  Mounted ball and roller bearings, rod ends, spherical bearings, application
                  solutions, and engineering guidance — 141 pages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                Browse catalog
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
