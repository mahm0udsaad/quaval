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
