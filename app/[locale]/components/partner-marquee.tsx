import Image from "next/image"

const partners = [
  ["SKF", "/images/gallery/batch1-13.png"], ["NTN"], ["SNR"], ["KSM"], ["RINGSPANN", "/images/gallery/batch1-16.png"], ["DODGE", "/images/gallery/batch1-17.jpg"], ["STC-STEYR", "/images/gallery/batch1-18.jpg"], ["KINEX", "/images/gallery/batch1-19.jpg"], ["OZAK", "/images/gallery/batch1-20.jpg"], ["HIWIN", "/images/gallery/batch1-23.jpg"], ["TIMKEN"], ["JIB"],
] as const

export default function PartnerMarquee() {
  return <section aria-label="Our partners" className="overflow-hidden border-y border-slate-200 bg-white py-5"><div className="mx-auto mb-3 max-w-7xl px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-text-light">Trusted partners</div><div className="partner-marquee flex w-max gap-4">{[...partners, ...partners].map(([name, image], index)=><div key={`${name}-${index}`} className="flex h-14 w-40 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"><>{image ? <Image src={image} alt="" width={34} height={34} className="h-8 w-8 object-contain" /> : null}<span className="text-sm font-bold tracking-wide text-secondary">{name}</span></></div>)}</div></section>
}
