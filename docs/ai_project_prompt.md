# Prompt: Generate a Greenfield Project

You are an expert full-stack engineer and product strategist. You will design and scaffold a brand-new software project from scratch. Follow the instructions precisely and ask clarifying questions before coding if any requirement is ambiguous.

## 1. Objectives
- Summarize the problem the product will solve, the target users, and the primary use cases.
- Define the value proposition and measurable success criteria.

## 2. Technical Blueprint
- Propose an end-to-end architecture (frontend, backend, infrastructure, third-party integrations).
- Justify framework, language, and tooling choices against the project goals.
- Outline data models, API surface, and workflows with diagrams or structured tables when useful.
- Define the product discovery flow: catalog list, search results, filtering, and pagination strategies.

### Product Page Display Requirements
- Replicate the Quaval reference layout when rendering individual products: hero gallery with zoom, pricing rail, stock badge, and related items grid.
- Document every field expected from the product API (identifiers, family data, dimensions, load ratings, technical attributes, suffix descriptions, parallel part mapping, applications, shipping/payment details, related product IDs).
- Provide a wireframe-level walkthrough of the page sections, explaining copy placement and interaction states (loading skeletons, error fallback, add-to-cart success).
- Include an example JSON payload and map each property to its on-screen location.
- Match the backend editor (`app/[locale]/admin/products/new/page.tsx`, `app/[locale]/admin/products/components/product-form.tsx:52`) with the storefront renderer (`app/[locale]/products/[id]/page.tsx:1`) so the field structure captured in the admin aligns with what the product detail page expects.

### Product Data Entry Alignment
- **Family block**: Admin selects or creates a product family, brand, and origin; these values populate the subtitle and general information panel in the product page.
- **Hero & gallery images**: `familyImages` in the form seed the `images` array used by the hero gallery and thumbnails. Ensure at least one URL is present to avoid the placeholder fallback.
- **Part number accordion**: Each part number entry captures the data rendered in each section:
  - Header fields (`part_number`, `price`, `stock_status`, `stock_quantity`) drive the H1, pricing rail, stock badge, and quantity picker.
  - `dimensions.bore | outerDiameter | width | weight` and `load_ratings.dynamic | static` fill the Dimensions and Bearing Specification table.
  - `technical_features` key/value pairs render in the Technical Features grid; include `Speed` and `Geometry Factor` keys for the spec table to remain complete.
  - `suffix_descriptions` and `parallel_products` objects map directly to definition lists in the matching page sections.
  - `applications`, `shipping_time`, `shipping_cost`, and `payment_methods` populate their respective lists and cards; avoid leaving them empty to keep the layout balanced.
  - `related_products` accepts an array of product IDs that feed the Related Products grid; ensure referenced IDs exist or the frontend will fetch nulls.
- **Uploads**: The form’s `uploadImage` helper stores files to Supabase storage and returns URLs; instruct teammates to either paste CDN URLs or use the uploader so the images resolve in the storefront.
- **Validation cues**: Reinforce that empty critical fields (images, part number, price) trigger toast errors in the form but may still produce incomplete UI if bypassed; confirm entries locally by opening the product page after submission.

#### Example Product Payload → UI Mapping

```json
{
  "id": 101,
  "part_number": "MG-6205-2RS",
  "family": { "name": "Deep Groove Ball Bearings", "brand": "Multigates", "origin": "Egypt" },
  "price": 1850.00,
  "currency": "EGP",
  "stock_status": "In Stock",
  "stock_quantity": 42,
  "images": [
    "https://cdn.multigates.com/products/mg-6205-2rs/hero.jpg",
    "https://cdn.multigates.com/products/mg-6205-2rs/angle.jpg"
  ],
  "dimensions": { "bore": "25 mm", "outerDiameter": "52 mm", "width": "15 mm", "weight": "0.13 kg" },
  "load_ratings": { "dynamic": "14.0 kN", "static": "7.85 kN" },
  "technical_features": {
    "Seal": "Double rubber seal",
    "Lubrication": "Pre-lubricated with lithium grease",
    "Speed": "12,000 rpm",
    "Geometry Factor": "0.95"
  },
  "suffix_descriptions": { "2RS": "Dual nitrile seals for dust protection" },
  "parallel_products": { "SKF": "6205-2RSH", "NSK": "6205DDU" },
  "applications": ["HVAC motors", "Agricultural pumps"],
  "shipping_time": "Ships within 2 business days across Egypt",
  "shipping_cost": "Calculated at checkout",
  "payment_methods": ["Cash on Delivery", "Fawry", "Visa"],
  "related_products": [102, 205]
}
```

- Hero gallery: `images` array with primary image highlighted; thumbnails switch the magnified view.
- Top-left details: `part_number` (H1), `family.name` (subtitle), quantity picker constrained by `stock_quantity`.
- Pricing rail: `price` formatted with `currency`, stock pill from `stock_status`, shipping and payment summaries from `shipping_cost` and `payment_methods`.
- Information blocks: `dimensions`, `load_ratings`, `technical_features`, `suffix_descriptions`, and `parallel_products` rendered as definition lists.
- Applications list: bullet list from `applications`.
- Shipping & payment cards: descriptive copy using `shipping_time` and `payment_methods`.
- Related grid: fetch entries listed in `related_products` IDs and reuse the catalog card template.

## 3. Delivery Plan
- Break down milestones, major features, and dependencies.
- Include risk assessment, mitigation strategies, and fallback options.
- Identify quality gates: code review policy, testing strategy, CI/CD approach, monitoring and alerting.

## 4. Scaffold & Artifacts
- Generate the project folder structure with explanations for each top-level directory.
- Provide initial configuration files (package manager, linters, formatters, environment variables) using minimal viable defaults.
- Stub core modules with descriptive TODO comments that state expected behaviors and inputs/outputs.

## 5. Documentation & Next Steps
- Deliver a README that includes quick start instructions, environment setup, and contribution guidelines.
- Suggest the next three high-impact tasks once the scaffold is in place.

## Output Format
Respond in Markdown using the following sections exactly: `Summary`, `Architecture`, `Data & APIs`, `Plan & Risks`, `Scaffold`, `Docs`, `Next Steps`. Use bullet lists and tables where they improve clarity.

## Quality Bar
- Be specific, actionable, and technically rigorous.
- Prefer convention-over-configuration defaults.
- Ensure the deliverable is self-consistent; every generated file or module referenced must exist in the scaffold.
- If an assumption is required, state it explicitly and continue.
