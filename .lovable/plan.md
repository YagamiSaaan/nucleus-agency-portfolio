# SEO Plan — Nucleus (snuggle-bright-flow.lovable.app)

A two-person studio site with two routes (`/`, `/works`). Goal: get Nucleus discoverable for studio/service searches, look sharp in link previews, and stay technically clean as the site grows.

## 1. Positioning & keyword targets

Nucleus is a small studio → we won't win broad head terms ("web design agency"). Target intent-rich, low-competition phrases:

- **Primary:** "high-end website design studio", "motion ad studio", "boutique web design studio"
- **Secondary:** "chrome aesthetic website design", "two person web studio", "custom motion ads for brands"
- **Brand:** "nucleus studio", "nucleus.xyz"

I'll validate volume/difficulty with Semrush before locking targets and adjust based on what's actually rankable for a new domain (Authority Score will start near zero).

## 2. Per-route metadata (title, description, OG)

Rewrite each route's `head()` with unique, keyword-led tags:

- **`/` (home)** — Title: "Nucleus — High-end websites & motion ads studio" · Description: benefit + who it's for, ~155 chars · og:title / og:description / og:image (existing chrome OG) / canonical self-ref.
- **`/works`** — Title: "Selected Works — Websites & Motion Ads · Nucleus" · Description focused on portfolio intent · canonical self-ref · og:image (generate a works-specific cover, or reuse home OG).

Add `og:url` and `<link rel="canonical">` on each leaf route (self-referencing absolute URLs to `https://snuggle-bright-flow.lovable.app/...`).

## 3. Structured data (JSON-LD)

Inject via `scripts` in `head()`:

- **Root:** `Organization` schema (name, URL, logo, sameAs → Instagram, contact email, founding date 2026).
- **Home:** `WebSite` schema with `SearchAction` placeholder, plus `ProfessionalService` describing the studio.
- **Works:** `CollectionPage` + `BreadcrumbList`.

## 4. Crawler files

- **`public/robots.txt`** — allow all, point to sitemap.
- **`src/routes/sitemap[.]xml.ts`** — server route listing `/` and `/works`, correct `<lastmod>`, `changefreq`, `priority`. Grows automatically as new routes are added.

## 5. Semantic HTML & accessibility audit

Pass through `index.tsx` and `works.tsx` to ensure:

- Exactly one `<h1>` per route (currently the hero uses styled text — confirm it's an `<h1>`).
- Logical `<h2>`/`<h3>` order for sections (About, Featured, Services, Contact).
- `alt` text on every `<img>` (project covers, chrome tiger, OG image references).
- Contact links use proper `aria-label`s and `rel="noopener"` for external links.
- `<main>`, `<section>`, `<nav>`, `<footer>` landmarks in place.

## 6. Performance signals (Core Web Vitals)

- Preload the hero chrome image and mark it `fetchpriority="high"`.
- Confirm `loading="lazy"` on below-fold imagery (works grid already does this).
- Keep the Google Fonts `<link>` with `preconnect` (already present) — consider `display=swap` (already set) and dropping unused weights if any.
- Verify no layout shift from the fluid chrome backdrops (they're absolutely positioned — should be fine).

## 7. Social preview

- Keep the current chrome OG image on `/`.
- Generate a distinct 1200×630 OG for `/works` so shared portfolio links don't collide with the home preview.
- `twitter:card = summary_large_image` (already set root-wide) — confirmed carries to child routes.

## 8. Search Console setup (after deploy)

Once you approve the plan:
1. Request a meta-tag verification token for `https://snuggle-bright-flow.lovable.app/`.
2. Embed it in `__root.tsx` head.
3. Call verify, then register the property.
4. Submit the sitemap URL.

## 9. Ongoing checks

- Run the built-in **SEO review** after changes ship (scans title/description/OG/canonical/robots/sitemap/JSON-LD).
- Run **Semrush domain_analysis** monthly to track keyword count + estimated traffic; **seo_trend** to catch drops.
- After the site is indexed (~2–4 weeks), run **serp_analysis** on primary keywords to see who we're ranked against and pivot copy if needed.

## Technical notes

- All head changes go via TanStack `head()` — `title` inside the `meta` array; `canonical` only on leaf routes (never `__root`) to avoid duplicate `<link>` emission.
- Sitemap uses the server-route pattern at `src/routes/sitemap[.]xml.ts`, not a static `public/sitemap.xml`.
- Base URL constant: `https://snuggle-bright-flow.lovable.app`.
- No route restructuring or content rewrites beyond metadata unless you ask — this is a pure SEO layer on top of the current design.

## Deliverables (build order)

1. `robots.txt` + `sitemap[.]xml.ts`
2. Per-route `head()` rewrites (`/`, `/works`) with canonical + og:url
3. JSON-LD blocks (Organization, WebSite, ProfessionalService, CollectionPage, BreadcrumbList)
4. Semantic/alt/accessibility pass
5. Works OG image generation
6. Trigger SEO review + Semrush baseline
7. Guide you through Search Console verification
