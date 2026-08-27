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
