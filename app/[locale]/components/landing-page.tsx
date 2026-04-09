'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import BearingFinder from './bearing-finder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { useTranslate } from '@/lib/i18n-client'

// Helper: safely extract array from i18next returnObjects (returns [] if key not found / string returned)
function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : []
}

type CatalogAsset = {
  name: string
  filePath: string | null
  description: string
  watermark?: string | null
}

type BrandCarouselItem = {
  name: string
  logo?: string
}

type HeroSlide = {
  src: string
  alt: string
  headline: string
  subhead: string
}

type ImplementationNote = {
  title: string
  body: string | string[]
}

type TimelineItem = {
  year: string
  detail: string
}

const brandCarouselItems: BrandCarouselItem[] = [
  { name: 'NTN', logo: '/images/NTN-SNR.jpg' },
  { name: 'KSM', logo: '/placeholder-logo.png' },
  { name: 'Timken', logo: '/images/Screenshot 2025-09-20 185305.png' },
  { name: 'FAG', logo: '/placeholder-logo.png' },
  { name: 'INA', logo: '/placeholder-logo.png' },
  { name: 'SNR', logo: '/images/NTN-SNR.jpg' },
  { name: 'Bower', logo: '/images/marka_md_14155432362670.jpg' },
  { name: 'Quaval', logo: '/Logo-transparent.png' },
  { name: 'JIB', logo: '/placeholder-logo.png' },
  { name: 'DKF', logo: '/images/history-kinex.jpg' },
  { name: 'Kinex', logo: '/images/history-kinex.jpg' },
  { name: 'SAM', logo: '/placeholder-logo.png' },
  { name: 'JMC', logo: '/placeholder-logo.png' },
  { name: 'EASE', logo: '/placeholder-logo.png' },
  { name: 'STC-STEYR', logo: '/images/STC-STEYR..png' },
  { name: 'Deutsche Grobwalzlager', logo: '/placeholder-logo.png' },
  { name: 'BCA', logo: '/images/marka_md_14155432362670.jpg' },
]

function HeroSection({ slides, badge }: { slides: HeroSlide[]; badge: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [slides])

  if (slides.length === 0) {
    return (
      <section className="flex h-[60vh] min-h-[360px] items-center justify-center rounded-3xl bg-slate-100">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-sm">
            Quaval Bearings
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">Premium Bearings, Global Reach</h1>
          <p className="mt-2 text-slate-600">Finalize hero copy in translations to enable animated hero.</p>
        </div>
      </section>
    )
  }

  const currentSlide = slides[activeIndex] ?? slides[0]

  return (
    <section className="relative h-[80vh] min-h-[520px] overflow-hidden rounded-3xl bg-slate-100">
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1800ms] ease-out',
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image src={slide.src} alt={slide.alt} fill className="object-cover" priority={index === 0} />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/55 via-slate-900/35 to-transparent" />
        </div>
      ))}
      <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-6 py-12 text-white md:px-16 lg:px-24">
        <span className="inline-flex w-max items-center rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-sm">
          {badge}
        </span>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">{currentSlide.headline}</h1>
        <p className="max-w-xl text-lg text-white/85 md:text-2xl">{currentSlide.subhead}</p>
      </div>
    </section>
  )
}

function CatalogViewer({
  asset,
  type,
  fallbackWatermark,
  pendingCopy,
  placeholderAlt,
}: {
  asset: CatalogAsset
  type: 'catalog' | 'certificate'
  fallbackWatermark: string
  pendingCopy: string
  placeholderAlt: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none select-none border-4 border-white/50 mix-blend-overlay" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rotate-12 text-lg font-semibold uppercase tracking-widest text-slate-200">
          {asset.watermark || fallbackWatermark}
        </span>
      </div>
      {asset.filePath ? (
        <iframe
          title={`${asset.name} ${type}`}
          src={asset.filePath}
          className="h-[380px] w-full border-0"
          sandbox="allow-scripts allow-same-origin"
          allowFullScreen={false}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-[380px] w-full flex-col items-center justify-center bg-slate-50 text-center">
          <Image
            src="/placeholder.svg"
            alt={placeholderAlt}
            width={120}
            height={120}
            draggable={false}
            className="opacity-60"
          />
          <p className="mt-6 max-w-xs text-sm text-slate-600">{asset.description}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">{pendingCopy}</p>
        </div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const { t, locale, direction } = useTranslate()
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const heroSlides = useMemo(
    () => safeArray<HeroSlide>(t('landing.hero.slides', { returnObjects: true })),
    [locale, t]
  )
  const heroBadge = t('landing.hero.badge')

  const catalogBrands = useMemo<CatalogAsset[]>(
    () => [
      { name: 'NTN', filePath: null, description: t('landing.catalogs.catalogDescriptions.ntn') },
      { name: 'SNR', filePath: null, description: t('landing.catalogs.catalogDescriptions.snr') },
      { name: 'Bower', filePath: null, description: t('landing.catalogs.catalogDescriptions.bower') },
      { name: 'BCA', filePath: null, description: t('landing.catalogs.catalogDescriptions.bca') },
      { name: 'KSM', filePath: null, description: t('landing.catalogs.catalogDescriptions.ksm') },
      { name: 'QUAVAL', filePath: null, description: t('landing.catalogs.catalogDescriptions.quaval') },
      { name: 'DKF', filePath: null, description: t('landing.catalogs.catalogDescriptions.dkf') },
      { name: 'KINEX', filePath: null, description: t('landing.catalogs.catalogDescriptions.kinex') },
      { name: 'TIMKEN', filePath: null, description: t('landing.catalogs.catalogDescriptions.timken') },
      { name: 'STC-STEYR', filePath: null, description: t('landing.catalogs.catalogDescriptions.stc') },
      { name: 'JIB', filePath: null, description: t('landing.catalogs.catalogDescriptions.jib') },
    ],
    [locale, t]
  )

  const certificateBrands = useMemo<CatalogAsset[]>(
    () => [
      {
        name: 'KSM',
        filePath: null,
        description: t('landing.catalogs.certificateDescriptions.ksm'),
        watermark: t('landing.catalogs.certificateWatermarks.ksm'),
      },
      {
        name: 'NTN',
        filePath: null,
        description: t('landing.catalogs.certificateDescriptions.ntn'),
        watermark: t('landing.catalogs.certificateWatermarks.ntn'),
      },
      {
        name: 'QUAVAL',
        filePath: null,
        description: t('landing.catalogs.certificateDescriptions.quaval'),
        watermark: t('landing.catalogs.certificateWatermarks.quaval'),
      },
      {
        name: 'DKF',
        filePath: null,
        description: t('landing.catalogs.certificateDescriptions.dkf'),
        watermark: t('landing.catalogs.certificateWatermarks.dkf'),
      },
      {
        name: 'STC-STEYR',
        filePath: null,
        description: t('landing.catalogs.certificateDescriptions.stc'),
        watermark: t('landing.catalogs.certificateWatermarks.stc'),
      },
    ],
    [locale, t]
  )

  const implementationNotes = useMemo(
    () => safeArray<ImplementationNote>(t('landing.catalogs.implementationNotes', { returnObjects: true })),
    [locale, t]
  )

  const bearingAdminNotes = useMemo(
    () => safeArray<ImplementationNote>(t('landing.bearingFinder.dataAdminNotes', { returnObjects: true })),
    [locale, t]
  )

  const timeline = useMemo(
    () => safeArray<TimelineItem>(t('landing.story.timeline', { returnObjects: true })),
    [locale, t]
  )

  const industries = useMemo(
    () => safeArray<string>(t('landing.industries.list', { returnObjects: true })),
    [locale, t]
  )

  const chatBullets = useMemo(
    () => safeArray<string>(t('landing.chat.bullets', { returnObjects: true })),
    [locale, t]
  )

  const assetNeeds = useMemo(
    () => safeArray<string>(t('landing.openItems.assets', { returnObjects: true })),
    [locale, t]
  )

  const configurationNeeds = useMemo(
    () => safeArray<string>(t('landing.openItems.configuration', { returnObjects: true })),
    [locale, t]
  )

  useEffect(() => {
    if (!carouselApi) return

    const autoplay = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext()
      } else {
        carouselApi.scrollTo(0)
      }
    }, 2400)

    return () => clearInterval(autoplay)
  }, [carouselApi])

  const brandChunks = useMemo(() => {
    const chunkSize = 6
    const chunks: BrandCarouselItem[][] = []
    for (let i = 0; i < brandCarouselItems.length; i += chunkSize) {
      chunks.push(brandCarouselItems.slice(i, i + chunkSize))
    }
    return chunks
  }, [])

  const ethicsCopy = useMemo(
    () => ({
      code: t('landing.values.code'),
      policy: t('landing.values.policy'),
      mission: t('landing.values.mission'),
      codeTitle: t('landing.values.codeTitle'),
      policyTitle: t('landing.values.policyTitle'),
      missionTitle: t('landing.values.missionTitle'),
    }),
    [locale, t]
  )

  return (
    <main className="space-y-24 bg-white pb-24 text-slate-900" dir={direction}>
      <div className="container mx-auto px-6 pt-12 md:px-10 lg:px-16">
        <HeroSection slides={heroSlides} badge={heroBadge} />
      </div>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
            <div>
              <h2 className="text-3xl font-semibold">{t('landing.catalogs.title')}</h2>
              <p className="mt-4 max-w-2xl text-slate-600">{t('landing.catalogs.description')}</p>

              <div className="mt-8">
                <Tabs defaultValue={catalogBrands[0]?.name ?? ''} className="w-full">
                  <TabsList className="flex flex-wrap gap-2 bg-white">
                    {catalogBrands.map((catalog) => (
                      <TabsTrigger key={catalog.name} value={catalog.name} className="rounded-full">
                        {catalog.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {catalogBrands.map((catalog) => (
                    <TabsContent key={catalog.name} value={catalog.name} className="mt-6">
                      <CatalogViewer
                        asset={catalog}
                        type="catalog"
                        fallbackWatermark={t('landing.catalogs.defaultWatermark')}
                        pendingCopy={t('landing.catalogs.pendingLabel')}
                        placeholderAlt={t('landing.catalogs.placeholderAlt', { brand: catalog.name })}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>

            <Card className="h-max border-slate-200 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">{t('landing.catalogs.implementationNotesTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                {implementationNotes.map((note, index) => (
                  <div key={`${note.title}-${index}`}>
                    <p className="font-semibold text-slate-900">{note.title}</p>
                    {Array.isArray(note.body) ? (
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {note.body.map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1">{note.body}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">{t('landing.catalogs.certificatesTitle')}</h3>
            <p className="mt-4 text-slate-600">{t('landing.catalogs.certificatesDescription')}</p>
            <Tabs defaultValue={certificateBrands[0]?.name ?? ''} className="mt-6">
              <TabsList className="flex flex-wrap gap-2 bg-slate-100/80">
                {certificateBrands.map((certificate) => (
                  <TabsTrigger key={certificate.name} value={certificate.name} className="rounded-full">
                    {certificate.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {certificateBrands.map((certificate) => (
                <TabsContent key={certificate.name} value={certificate.name} className="mt-6">
                  <CatalogViewer
                    asset={certificate}
                    type="certificate"
                    fallbackWatermark={t('landing.catalogs.defaultWatermark')}
                    pendingCopy={t('landing.catalogs.pendingLabel')}
                    placeholderAlt={t('landing.catalogs.placeholderAlt', { brand: certificate.name })}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div>
            <h2 className="text-3xl font-semibold">{t('landing.bearingFinder.sectionTitle')}</h2>
            <p className="mt-4 max-w-2xl text-slate-600">{t('landing.bearingFinder.description')}</p>
            <div className="mt-8">
              <BearingFinder />
            </div>
          </div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('landing.bearingFinder.dataAdminTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              {bearingAdminNotes.map((note, index) => (
                <div key={`${note.title}-${index}`}>
                  <p className="font-semibold text-slate-900">{note.title}</p>
                  {Array.isArray(note.body) ? (
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {note.body.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1">{note.body}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <h2 className="text-3xl font-semibold">{t('landing.brands.title')}</h2>
          <p className="mt-4 max-w-2xl text-white/75">{t('landing.brands.description')}</p>
          <div className="mt-10 rounded-3xl bg-white/5 p-6 backdrop-blur">
            <Carousel className="w-full" setApi={setCarouselApi} opts={{ loop: true }}>
              <CarouselContent className="-ml-4">
                {brandChunks.map((chunk, index) => (
                  <CarouselItem key={index} className="basis-full pl-4 md:basis-1/2">
                    <div className="grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
                      {chunk.map((brand) => (
                        <div key={brand.name} className="flex h-20 items-center justify-center rounded-xl bg-white/10 p-4">
                          {brand.logo ? (
                            <Image src={brand.logo} alt={brand.name} width={140} height={60} className="object-contain" />
                          ) : (
                            <span className="text-sm font-semibold uppercase tracking-wide text-white/80">
                              {brand.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{ethicsCopy.codeTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">{ethicsCopy.code}</CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{ethicsCopy.policyTitle}</CardTitle>
            </CardHeader>
            <CardContent className="font-semibold text-primary">{ethicsCopy.policy}</CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{ethicsCopy.missionTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">{ethicsCopy.mission}</CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">{t('landing.story.title')}</h2>
              <p className="text-slate-600">{t('landing.story.description')}</p>
              <ul className="space-y-3 text-slate-600">
                {timeline.map((item, index) => (
                  <li key={`${item.year}-${index}`} className="flex gap-4">
                    <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase text-white">
                      {item.year}
                    </span>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg">
              <Image
                src="/images/about-us-02.jpg"
                alt={t('landing.story.imageAlt')}
                width={720}
                height={540}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold">{t('landing.story.overlayTitle')}</h3>
                <p className="mt-2 text-sm text-white/80">{t('landing.story.overlayDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">{t('landing.industries.title')}</h2>
          <p className="mt-4 max-w-3xl text-slate-600">{t('landing.industries.description')}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, index) => (
              <div key={`${industry}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-medium text-slate-700">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr,1fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">{t('landing.chat.title')}</h2>
              <p className="text-white/80">{t('landing.chat.description')}</p>
              <ul className="space-y-2 text-white/80">
                {chatBullets.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-white/5 p-6 backdrop-blur">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 text-slate-900">
                <div className="flex items-center gap-3">
                  <Image
                    src="/professional-woman-headshot.png"
                    alt={t('landing.chat.assistantAlt')}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{t('landing.chat.assistantName')}</p>
                    <p className="text-sm text-white/70">{t('landing.chat.assistantSubtitle')}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-white/85">
                  <div className="rounded-2xl bg-white/15 p-4">{t('landing.chat.sampleMessages.greeting')}</div>
                  <div className="ml-auto max-w-[220px] rounded-2xl bg-primary/90 p-4 text-white">
                    {t('landing.chat.sampleMessages.customer')}
                  </div>
                  <div className="rounded-2xl bg-white/15 p-4">{t('landing.chat.sampleMessages.response')}</div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
                    {t('landing.chat.sampleMessages.cta')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">{t('landing.video.title')}</h2>
            <p className="text-slate-600">{t('landing.video.description')}</p>
            <p className="text-sm text-slate-500">{t('landing.video.specification')}</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
            <video className="h-full w-full object-cover" controls loop muted poster="/images/footer01.jpg">
              <source src="/media/brand-film-placeholder.mp4" type="video/mp4" />
              {t('landing.video.fallback')}
            </video>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <h2 className="text-3xl font-semibold">{t('landing.openItems.title')}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-3xl bg-white/10 p-6">
              <h3 className="text-xl font-semibold">{t('landing.openItems.assetsTitle')}</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                {assetNeeds.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-3 rounded-3xl bg-white/10 p-6">
              <h3 className="text-xl font-semibold">{t('landing.openItems.configurationTitle')}</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                {configurationNeeds.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
