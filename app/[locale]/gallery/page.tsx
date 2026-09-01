import Image from "next/image"
import { Images, ShieldCheck } from "lucide-react"

const galleryItems = [
  ["batch3-01.png", "Deep groove ball bearing", "Product"],
  ["batch3-02.jpg", "Industrial bearing application", "Industry"],
  ["batch3-03.jpg", "Industrial production environment", "Industry"],
  ["batch3-04.jpg", "Bearing assembly", "Product"],
  ["batch3-05.jpg", "Bearing product detail", "Product"],
  ["batch3-06.jpg", "Precision bearing component", "Product"],
  ["batch3-07.jpg", "Industrial machinery", "Industry"],
  ["batch3-08.jpg", "Manufacturing environment", "Industry"],
  ["batch2-01.jpg", "Engineering at work", "Industry"],
  ["batch2-02.jpg", "Industrial operations", "Industry"],
  ["batch2-03.jpg", "Factory environment", "Industry"],
  ["batch2-04.png", "Industrial product reference", "Product"],
  ["batch2-05.png", "Industrial product reference", "Product"],
  ["batch2-06.png", "Quaval product reference", "Product"],
  ["batch2-07.jpg", "Bearing manufacturing history", "Company"],
  ["batch2-08.jpg", "Bearing heritage", "Company"],
  ["batch2-09.jpg", "Industrial equipment", "Industry"],
  ["batch2-10.png", "Bearing product range", "Product"],
  ["batch2-11.jpg", "Rail bearing solution", "Industry"],
  ["batch2-12.png", "Spherical roller bearing", "Product"],
  ["batch2-13.png", "Bearing product reference", "Product"],
  ["batch2-14.png", "Bearing product reference", "Product"],
] as const

const additionalItems = [
  ["taper_roller_bearing.webp", "Taper roller bearing", "Product"] as const,
  ["brg.webp", "Bearing product detail", "Product"] as const,
  ["mcgill.webp", "McGill bearing solution", "Product"] as const,
  ["p-bu-rhp-self-lube-5comp.webp", "RHP Self-Lube bearing components", "Product"] as const,
  ["rodamientos-iko-japan.webp", "IKO Japan bearing solution", "Product"] as const,
  ["SA-208-JIB-BEARING.webp", "JIB SA-208 bearing", "Product"] as const,
  ["ozak-linear-motion-systems-500x500.webp", "OZAK linear motion system", "Product"] as const,
  ["Rollway.webp", "Rollway bearing solution", "Product"] as const,
  ["Needle Roller Bearings with Angular Contact Thrust Bearings.avif", "Needle roller and angular contact thrust bearings", "Product"] as const,
  ["STIEBER.avif", "Stieber bearing solution", "Product"] as const,
  ["O1CN01LuUU9U1Cp80NJNvKO_!!6000000000129-0-icbu_video_cover.avif", "Industrial bearing assembly", "Product"] as const,
  ["S101e6849963148e699c3e9deab4cc0cdo.avif", "Precision bearing product", "Product"] as const,
  ["Bearings for Rolling Stock.avif", "Bearings for rolling stock", "Industry"] as const,
  ...[[1, "png"], [2, "jpg"], [3, "jpg"], [4, "jpg"], [5, "png"], [6, "jpg"], [7, "png"], [8, "jpg"], [9, "png"], [10, "png"], [11, "jpg"], [12, "jpg"], [13, "png"], [14, "jpg"], [15, "jpg"], [16, "png"], [17, "jpg"], [18, "jpg"], [19, "jpg"], [20, "jpg"], [21, "jpg"], [22, "jpg"], [23, "jpg"], [24, "jpg"], [25, "jpg"], [26, "jpg"], [27, "jpg"], [28, "jpg"], [29, "jpg"], [30, "jpg"], [31, "png"], [32, "jpg"], [33, "jpg"], [34, "jpg"], [35, "png"], [36, "jpg"], [37, "jpg"], [38, "jpg"]].map(([index, extension]) => [`batch1-${String(index).padStart(2, "0")}.${extension}`, "Industrial bearing and product reference", "Product"] as const),
  ...[[15, "png"], [16, "jpg"], [17, "png"], [18, "jpg"], [19, "jpg"], [20, "jpg"], [21, "jpg"], [22, "jpg"]].map(([index, extension]) => [`batch2-${String(index).padStart(2, "0")}.${extension}`, "Industrial bearing and product reference", "Product"] as const),
]

export default function GalleryPage() {
  return (
    <div className="bg-background">
      <section className="relative isolate overflow-hidden bg-secondary py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,86,179,0.55),_transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white"><Images className="h-3.5 w-3.5" /> Quaval Gallery</div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">The people, products, and industries behind reliable motion.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">A visual collection of bearing technologies, industrial environments, and the applications Quaval helps keep moving.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">In focus</p><h2 className="mt-2 text-3xl font-bold text-secondary">Industrial expertise in every frame.</h2></div>
          <div className="flex items-center gap-3 text-sm leading-6 text-text-light sm:max-w-xs"><ShieldCheck className="h-6 w-6 shrink-0 text-primary" />Original imagery supplied by Quaval, presented for on-site viewing.</div>
        </section>

        <section aria-labelledby="gallery-grid-heading" className="mt-12">
          <div className="flex items-baseline justify-between gap-4"><h2 id="gallery-grid-heading" className="text-2xl font-bold text-secondary sm:text-3xl">Gallery collection</h2><p className="text-sm text-text-light">Products · Industry · Company</p></div>
          <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {[...galleryItems, ...additionalItems].map(([image, alt, category]) => (
              <figure key={image} className="mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><Image src={`/images/gallery/${image}`} alt={alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div>
                <figcaption className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-sm font-medium text-secondary">{alt}</span><span className="text-xs font-semibold uppercase tracking-wider text-primary">{category}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
