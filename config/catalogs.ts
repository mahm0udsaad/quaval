export type Catalog = {
  id: string
  title: string
  shortTitle: string
  description: string
  pageCount: number
  pageDirectory: string
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
