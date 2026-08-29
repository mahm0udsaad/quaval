export type Catalog = {
  id: string
  title: string
  shortTitle: string
  description: string
  pageCount: number
  pageDirectory: string
  fileExtension?: "jpg" | "webp"
  pageNumberPadding?: number
  pageWidth?: number
  pageHeight?: number
}

export type PdfCatalog = {
  id: string
  title: string
  shortTitle: string
  description: string
  pageCount: number
  sourceUrl: string
}

export const quavalCatalogs: Catalog[] = [
  {
    id: "roller-bearings",
    title: "Quaval Roller Bearings Catalog",
    shortTitle: "Roller Bearings",
    description:
      "Technical dimensions, load ratings, and specifications for Quaval roller bearing ranges.",
    pageCount: 42,
    pageDirectory: "/catalogs/quaval/roller",
  },
  {
    id: "deep-groove-ball-bearings",
    title: "Quaval Deep Groove Ball Bearings Catalog",
    shortTitle: "Deep Groove Ball Bearings",
    description:
      "Technical dimensions, load ratings, and specifications for Quaval deep groove ball bearings.",
    pageCount: 22,
    pageDirectory: "/catalogs/quaval/dgbb",
  },
]

export const timkenCatalogs: Catalog[] = [
  {
    id: "tapered-roller-bearings",
    title: "Timken Tapered Roller Bearing Catalog",
    shortTitle: "Tapered Roller Bearings",
    description:
      "Product selection, engineering data, dimensions, and load ratings for Timken tapered roller bearings.",
    pageCount: 760,
    pageDirectory: "/catalogs/timken/tapered-roller",
    fileExtension: "webp",
    pageNumberPadding: 3,
    pageWidth: 935,
    pageHeight: 1197,
  },
  {
    id: "spherical-roller-bearings",
    title: "Timken Spherical Roller Bearing Catalog",
    shortTitle: "Spherical Roller Bearings",
    description:
      "Technical guidance, product dimensions, and performance data for Timken spherical roller bearings.",
    pageCount: 156,
    pageDirectory: "/catalogs/timken/spherical-roller",
    fileExtension: "webp",
    pageNumberPadding: 3,
    pageWidth: 935,
    pageHeight: 1210,
  },
  {
    id: "ap-bearing-installation",
    title: "Timken AP and AP-2 Bearing Installation Manual",
    shortTitle: "AP / AP-2 Installation",
    description:
      "Installation and maintenance guidance for Timken AP and AP-2 railroad bearing assemblies.",
    pageCount: 24,
    pageDirectory: "/catalogs/timken/ap-bearing-installation",
    fileExtension: "webp",
    pageNumberPadding: 3,
    pageWidth: 935,
    pageHeight: 1210,
  },
  {
    id: "mounted-bearing-housing-strength",
    title: "Timken Mounted Bearing Housing Strength",
    shortTitle: "Housing Strength",
    description:
      "A technical article covering mounted-bearing housing strength, test methods, and safe-load guidance.",
    pageCount: 10,
    pageDirectory: "/catalogs/timken/housing-strength",
    fileExtension: "webp",
    pageNumberPadding: 3,
    pageWidth: 935,
    pageHeight: 1210,
  },
]

export const skfCatalogs: PdfCatalog[] = [
  {
    id: "rolling-bearings",
    title: "SKF Rolling Bearings Catalog",
    shortTitle: "Rolling Bearings",
    description:
      "Bearing selection guidance, product data, dimensions, load ratings, and engineering recommendations from SKF.",
    pageCount: 1152,
    sourceUrl: "/api/catalogs/skf",
  },
]

export const stcSteyrCatalogs: PdfCatalog[] = [
  {
    id: "delivery-programme",
    title: "STC-STEYR Delivery Programme",
    shortTitle: "Rolling Bearings",
    description:
      "STC-STEYR product ranges, bearing designations, dimensions, and technical reference tables.",
    pageCount: 250,
    sourceUrl: "/api/catalogs/stc-steyr",
  },
]

export const jibCatalogs: PdfCatalog[] = [
  {
    id: "ball-bearing-units",
    title: "JIB Ball Bearing Units Catalog",
    shortTitle: "Ball Bearing Units",
    description:
      "JIB bearing-unit selection, technical guidance, housings, materials, dimensions, and load data.",
    pageCount: 141,
    sourceUrl: "/api/catalogs/jib",
  },
]

export const ksmCatalogs: PdfCatalog[] = [
  {
    id: "bearing-catalog-2014",
    title: "KSM Bearing Catalog 2014",
    shortTitle: "Complete Bearing Range",
    description:
      "KSM ball, needle, track, linear, tapered and spherical roller bearings, housings, sleeves, and bearing units.",
    pageCount: 451,
    sourceUrl: "/api/catalogs/ksm",
  },
]

export const ntnCatalogs: PdfCatalog[] = [
  {
    id: "ball-and-roller-bearings",
    title: "NTN Ball and Roller Bearings Catalog",
    shortTitle: "Ball and Roller Bearings",
    description:
      "NTN bearing selection guidance, ball and roller bearing ranges, dimensions, ratings, and engineering data.",
    pageCount: 411,
    sourceUrl: "/api/catalogs/ntn",
  },
]

export const kinexCatalogs: PdfCatalog[] = [
  {
    id: "rolling-bearings",
    title: "KINEX Rolling Bearings Catalog",
    shortTitle: "Rolling Bearings",
    description:
      "KINEX engineering guidance, rolling-bearing ranges, accessories, dimensions, and load data.",
    pageCount: 311,
    sourceUrl: "/api/catalogs/kinex",
  },
]

export const schneebergerCatalogs: PdfCatalog[] = [
  {
    id: "minislide-msqscale",
    title: "SCHNEEBERGER MINISLIDE MSQscale Catalog",
    shortTitle: "MINISLIDE MSQscale",
    description:
      "Integrated distance measurement, technical data, options, accessories, dimensions, and load capacities for MINISLIDE MSQscale.",
    pageCount: 27,
    sourceUrl: "/api/catalogs/schneeberger-msqscale",
  },
  {
    id: "mini-x",
    title: "SCHNEEBERGER MINI-X Product Catalog",
    shortTitle: "MINI-X",
    description:
      "MINIRAIL, MINISCALE PLUS, and MINISLIDE miniature linear-motion products, dimensions, and engineering data.",
    pageCount: 93,
    sourceUrl: "/api/catalogs/schneeberger-mini-x",
  },
  {
    id: "gear-racks",
    title: "SCHNEEBERGER Gear Racks Product Catalog",
    shortTitle: "Gear Racks",
    description:
      "Standard and customized gear-rack solutions, technical guidance, materials, accuracy classes, and dimensions.",
    pageCount: 33,
    sourceUrl: "/api/catalogs/schneeberger-gear-racks",
  },
  {
    id: "slides",
    title: "SCHNEEBERGER Slides Product Catalog",
    shortTitle: "Slides",
    description:
      "Dynamic and precise slide products with selection guidance, technical characteristics, and dimensional data.",
    pageCount: 34,
    sourceUrl: "/api/catalogs/schneeberger-slides",
  },
  {
    id: "mineral-casting",
    title: "SCHNEEBERGER Mineral Casting Catalog",
    shortTitle: "Mineral Casting",
    description:
      "Mineral-casting capabilities, customer benefits, integrated systems, manufacturing, and application examples.",
    pageCount: 8,
    sourceUrl: "/api/catalogs/schneeberger-mineral-casting",
  },
]

export const dodgeCatalogs: PdfCatalog[] = [
  {
    id: "bearing-engineering",
    title: "Dodge Bearing Engineering Catalog",
    shortTitle: "Bearing Engineering",
    description:
      "Mounted roller bearings, Sleevoil hydrodynamic bearings, plain and journal bearings, take-up frames, selection guidance, and engineering data.",
    pageCount: 756,
    sourceUrl: "/api/catalogs/dodge",
  },
]

export const mcgillCatalogs: PdfCatalog[] = [
  {
    id: "cam-follower-bearings",
    title: "McGill Cam Follower Bearings Catalog",
    shortTitle: "Cam Follower Bearings",
    description:
      "CAMROL cam followers, yoke rollers, inch and metric product ranges, dimensions, load ratings, selection guidance, and engineering data.",
    pageCount: 156,
    sourceUrl: "/api/catalogs/mcgill",
  },
]

export const linkBeltCatalogs: PdfCatalog[] = [
  {
    id: "bearing-catalog",
    title: "Link-Belt & Rex Bearing Catalog",
    shortTitle: "Bearing Catalog",
    description:
      "Rex and Link-Belt mounted spherical roller bearings, ball bearings, sleeve bearings, cylindrical roller bearings, selection guidance, dimensions, and engineering data.",
    pageCount: 544,
    sourceUrl: "/api/catalogs/link-belt",
  },
]

export const fsqCatalogs: PdfCatalog[] = [
  {
    id: "bearing-housings",
    title: "FSQ Bearing Housings and Accessories Catalog",
    shortTitle: "Bearing Housings",
    description:
      "Split pillow and plummer blocks, seals, adapter and withdrawal sleeves, hydraulic sleeves, dimensions, materials, and designation guidance.",
    pageCount: 92,
    sourceUrl: "/api/catalogs/fsq-bearing-housings",
  },
  {
    id: "pillow-block-bearing-units",
    title: "FSQ Pillow Block Bearing Units Catalog",
    shortTitle: "Pillow Block Bearing Units",
    description:
      "Pillow block and bearing-unit series with dimensional drawings, shaft sizes, load ratings, housing references, and weights.",
    pageCount: 49,
    sourceUrl: "/api/catalogs/fsq-pillow-blocks",
  },
]

export const ikoCatalogs: PdfCatalog[] = [
  {
    id: "dimension-interchange-table",
    title: "IKO Dimension and Interchange Table",
    shortTitle: "Dimension & Interchange",
    description:
      "Dimensional and interchange references for IKO needle roller bearings, cam followers, roller followers, linear-motion products, and related bearing series.",
    pageCount: 172,
    sourceUrl: "/api/catalogs/iko",
  },
]

export const kashimaCatalogs: PdfCatalog[] = [
  {
    id: "plain-bushings",
    title: "Kashima Plastic Bushings and Plain Bearings",
    shortTitle: "Plain Bearings",
    description:
      "Plastic bushings and plain-bearing materials, characteristics, selection guidance, dimensions, and application references.",
    pageCount: 10,
    sourceUrl: "/api/catalogs/kashima-plain-bushings",
  },
  {
    id: "pillow-blocks",
    title: "Kashima Low-Maintenance UKB Pillow Blocks",
    shortTitle: "UKB Pillow Blocks",
    description:
      "Self-aligning, low-maintenance UKB pillow blocks with product features, available materials, dimensions, and selection data.",
    pageCount: 8,
    sourceUrl: "/api/catalogs/kashima-pillow-blocks",
  },
  {
    id: "ball-bearings",
    title: "Kashima UKB Ball Bearings",
    shortTitle: "UKB Ball Bearings",
    description:
      "Self-lubricating plastic ball bearings for dry, wet, chemical, magnetic, and other special environments, with dimensions and technical data.",
    pageCount: 18,
    sourceUrl: "/api/catalogs/kashima-ball-bearings",
  },
]

export const ozakCatalogs: PdfCatalog[] = [
  {
    id: "linear-bearings",
    title: "OZAK Linear Bearings Catalog",
    shortTitle: "Linear Bearings",
    description:
      "OZAK linear bearings, guides, ball screws, support units, actuators, selection guidance, performance data, and product dimensions.",
    pageCount: 456,
    sourceUrl: "/api/catalogs/ozak",
  },
]

export const fyhCatalogs: PdfCatalog[] = [
  {
    id: "mounted-bearing-units",
    title: "FYH Mounted Bearing Units Catalog",
    shortTitle: "Mounted Bearing Units",
    description:
      "FYH ball-bearing inserts, pillow and flange units, take-up and cartridge units, stainless and thermoplastic series, selection guidance, and dimensions.",
    pageCount: 224,
    sourceUrl: "/api/catalogs/fyh",
  },
]

export const hiwinCatalogs: PdfCatalog[] = [
  {
    id: "linear-guideway",
    title: "HIWIN Linear Guideway Technical Information",
    shortTitle: "Linear Guideway",
    description:
      "Linear guideway principles, selection, lubrication, accuracy, preload, load ratings, product series, accessories, and dimensions.",
    pageCount: 245,
    sourceUrl: "/api/catalogs/hiwin-linear-guideway",
  },
  {
    id: "ballscrew",
    title: "HIWIN Ballscrew Technical Information",
    shortTitle: "Ballscrew",
    description:
      "Ballscrew design, selection, accuracy, preload, lubrication, mounting, product series, support units, and dimensional data.",
    pageCount: 220,
    sourceUrl: "/api/catalogs/hiwin-ballscrew",
  },
]

export const nadellaCatalogs: PdfCatalog[] = [
  {
    id: "needle-bearings",
    title: "Nadella Needle Bearings Catalog",
    shortTitle: "Needle Bearings",
    description:
      "Needle cages, drawn-cup and machined-ring needle bearings, combined and thrust bearings, support and track rollers, selection guidance, and dimensions.",
    pageCount: 190,
    sourceUrl: "/api/catalogs/nadella-needle-bearings",
  },
  {
    id: "cam-followers-track-rollers",
    title: "Nadella Cam Followers and Track Rollers Catalog",
    shortTitle: "Cam Followers (Italian)",
    description:
      "Italian-language publication covering cam followers and track rollers, product variants, technical characteristics, load data, and dimensions.",
    pageCount: 61,
    sourceUrl: "/api/catalogs/nadella-cam-followers",
  },
]

export const stieberCatalogs: PdfCatalog[] = [
  {
    id: "overrunning-clutches-backstops",
    title: "Stieber Overrunning Clutches and Backstops Catalog",
    shortTitle: "Clutches & Backstops",
    description:
      "Stieber overrunning-clutch and backstop designs, selection guidance, operating principles, applications, technical data, and dimensions.",
    pageCount: 96,
    sourceUrl: "/api/catalogs/stieber",
  },
]
