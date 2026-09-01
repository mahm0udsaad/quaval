import { ArrowLeftRight, BadgeDollarSign, BookOpen, Boxes, CircleGauge, FileSearch, Handshake, Headphones, PackageCheck, Ship, Store, Warehouse } from "lucide-react"

const offers = [
  [BadgeDollarSign, "Competitive pricing", "Fair and competitive pricing for traders, commercial companies, and distributors, with flexible payment terms from 6 to 18 months in cooperation with major Egyptian banks."],
  [Handshake, "Distribution requests", "We welcome professional distribution requests and work toward fair, mutually beneficial arrangements for every party."],
  [Store, "Partner products", "Trading companies, distributors, and importers may showcase original, recently manufactured, high-quality products through our marketplace under reasonable and fair commission terms."],
  [Headphones, "Technical support & after-sales", "Complimentary technical support is available to registered trading and commercial customers, with practical assistance before and after supply."],
  [BookOpen, "Catalogs & technical documentation", "Product catalogs and technical documentation are available upon request to support our business partners in their operations."],
  [Ship, "Shipping & delivery service", "Coordinated shipping and delivery support helps industrial and commercial customers receive the products they require."],
  [PackageCheck, "Import services for third parties", "We import bearings on behalf of commercial and industrial companies, charging reasonable and fair commissions."],
  [Warehouse, "Stock at customer site", "We provide and manage inventory at a client location based on its requirements, helping maintain continuous product availability."],
  [Boxes, "Partner brands", "Qualified partners may present original, high-quality, recently produced items through the Quaval marketplace."],
  [ArrowLeftRight, "Cross reference", "We help clients and partners identify equivalent bearings from different brands for compatibility and reliable performance."],
  [FileSearch, "Failure analysis", "Quaval supports the review of bearing failures and operating conditions to help customers identify likely causes and appropriate next actions."],
  [CircleGauge, "Interchange catalog", "The interchange catalog is being prepared and will be added to the website when the approved source is ready."],
] as const

export default function WhatWeOfferPage() {
  return <div className="bg-background">
    <section className="relative isolate overflow-hidden bg-secondary py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,86,179,0.55),_transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-200">What we offer</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Industrial support beyond the bearing.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">Commercial flexibility, technical knowledge, inventory solutions, and dependable delivery for demanding operations.</p>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map(([Icon, title, description]) => <article key={title} tabIndex={0} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus:-translate-y-1 focus:border-primary/40 focus:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary group-focus:bg-primary"><Icon className="h-6 w-6 text-primary transition group-hover:text-white group-focus:text-white" /></div>
          <h2 className="mt-5 text-xl font-bold text-secondary">{title}</h2>
          <p className="mt-3 leading-7 text-text-light">{description}</p>
        </article>)}
      </div>
    </main>
  </div>
}
