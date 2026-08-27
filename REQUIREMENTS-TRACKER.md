# Mr Sameh Quaval Website Requirements Tracker

Audit started: 2026-08-26

Source: Gmail messages from `ceo@quaval.ca`, processed chronologically. This tracker covers the Canadian Quaval website only; Multi Gates Egypt requests are excluded. Later emails override earlier instructions.

Status definitions:

- **Complete** — implemented and verified against the email.
- **Partial** — some of the requirement exists, but a documented gap remains.
- **Missing** — not implemented yet.
- **Superseded** — replaced or cancelled by a later email.
- **Pending client input** — implementation requires content or a decision Sameh has not supplied.

## About page

| ID | Email evidence | Atomic requirement | Status | Implementation/evidence | Action taken |
|---|---|---|---|---|---|
| A01 | 2026-04-13 `19d86a19d46c4cb8` | State that Quaval ships within and outside Canada by express, air freight, ground, and ocean freight according to customer preference | Complete | `app/[locale]/about-us/page.jsx`, Multiple Shipping Options card | Replaced the partial shipping copy with Sameh's complete requested statement |
| A02 | 2026-04-13 `19d86a19d46c4cb8` | Add the Leonardo da Vinci, Agostino Ramelli, bearing-cage, and Galileo history statement | Complete | `app/[locale]/about-us/page.jsx`, Bearing Innovation Through History section | Added a dedicated responsive bearing-history section using the supplied content |

## Products page

| ID | Email evidence | Atomic requirement | Status | Implementation/evidence | Action taken |
|---|---|---|---|---|---|
| P01 | 2026-04-13 `19d87159ae1f4c60` | Let visitors identify a bearing by dimensions and type and return its bearing number and associated brand | Complete | `app/[locale]/components/product-bearing-finder.tsx`, rendered by `app/[locale]/products/page.tsx`; searches the live Supabase product result set | Replaced the disconnected two-example prototype with an exact dimension/type finder covering every dimensioned product currently returned by Supabase |

## Catalogs and certificates

| ID | Email evidence | Atomic requirement | Status | Implementation/evidence | Action taken |
|---|---|---|---|---|---|
| C01 | 2026-04-13 `19d87159ae1f4c60`; 2026-08-17 `1a0114caa3bed9ef` | Make the supplied Quaval catalogs available for online browsing without offering the source documents for download | Complete | `app/[locale]/catalogs/quaval/page.tsx`, `components/catalogs/CatalogViewer.tsx`; 42-page Roller Bearings and 22-page Deep Groove Ball Bearings catalogs rendered as page images with no public PDF; Catalogs link is available in the desktop and mobile header | Added a paginated, zoomable viewer; removed the source-PDF download path; disabled ordinary save/print shortcuts, dragging, and the context menu; added a view-only watermark. Browser screenshots cannot be technically prevented, so these controls are deterrents rather than an absolute guarantee. |
| C02 | 2026-04-13 `19d87159ae1f4c60` | Make distribution certificates viewable online without download or screenshots | Partial | `app/[locale]/catalogs/page.tsx` now provides a non-broken pending state instead of links to missing pages | Viewer framework is ready, but the certificate source files have not yet been processed in the chronological audit. |
| C03 | 2026-08-19 `1a01b0fa3ef20333` | Add Catalog Page 2 for Timken using the four supplied publications | Complete | `app/[locale]/catalogs/timken/page.tsx`, `config/catalogs.ts`, and `public/catalogs/timken/`; four online viewers covering 950 pages | Source PDFs remain outside the public site; compact page images use the established view-only viewer and Quaval theme. |
| C04 | 2026-08-19 `1a01bb9de0c6c1c0` | Add Catalog Page 4 for SKF using the catalog on Quaval's Canadian website | Complete | `app/[locale]/catalogs/skf/page.tsx`, `components/catalogs/PdfCatalogViewer.tsx`, and allowlisted proxy `app/api/catalogs/[catalog]/route.ts`; 1,152-page online viewer | Uses Mozilla PDF.js to render one page at a time from Quaval's official SKF source while retaining the established controls, watermark, and theme; no download button is exposed. |
| C05 | 2026-08-19 `1a01bbdd75454bf0` | Add Catalog Page 5 for STC-STEYR using the supplied delivery programme | Complete | `app/[locale]/catalogs/stc-steyr/page.tsx`, `public/catalog-documents/stc-steyr/source.bin`, and the shared PDF viewer; 250-page online viewer | The original attachment is served through the allowlisted catalog proxy and rendered one page at a time with the established controls, watermark, and Quaval theme. |
| C06 | 2026-08-19 `1a01bc02b080d32d` | Add Catalog Page 6 for JIB using the supplied 2025 English catalog | Complete | `app/[locale]/catalogs/jib/page.tsx`, `public/catalog-documents/jib/source.bin`, and the shared PDF viewer; 141-page online viewer | The original attachment is served through the allowlisted catalog proxy and rendered one page at a time with the established controls, watermark, and Quaval theme. |
| C07 | 2026-08-19 `1a01bc5244188c20` | Add Catalog Page 7 for KSM using the supplied compressed catalog | Complete | `app/[locale]/catalogs/ksm/page.tsx`, `public/catalog-documents/ksm/source.bin`, and the shared PDF viewer; 451-page online viewer | The Gmail preview indexed only 150 pages, but the original PDF was verified at 451 pages and the complete attachment is used. |

## Pending chronological audit

The remaining messages will be added here one at a time as each requirement is verified and implemented.
