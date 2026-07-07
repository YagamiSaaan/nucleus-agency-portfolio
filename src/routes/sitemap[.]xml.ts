/**
 * @file src/routes/sitemap[.]xml.ts
 *
 * Dynamic `/sitemap.xml` endpoint. The `[.]` in the filename escapes
 * the literal dot so TanStack Router resolves it to `/sitemap.xml`
 * instead of a nested `/sitemap/xml` path.
 *
 * The XML is generated per-request rather than shipped as a static
 * file so that:
 * - `<lastmod>` always reflects the current date.
 * - New routes only need to be listed here — no separate build step.
 * - A CDN can still cache the response (see `Cache-Control` header).
 */
import { createFileRoute } from "@tanstack/react-router";
// The empty type-only import prevents TS from tree-shaking the
// TanStack Start augmentation of `createFileRoute` (adds the
// `server` option). It is intentional — do not remove.
import type {} from "@tanstack/react-start";

/**
 * Site origin used to build absolute `<loc>` values. Matches the value
 * used in per-route `canonical` / `og:url` tags — keep them in sync.
 */
const BASE_URL = "https://snuggle-bright-flow.lovable.app";

/** One entry in the sitemap. Optional fields are omitted from the XML when unset. */
interface SitemapEntry {
  /** Path relative to {@link BASE_URL}, e.g. `"/works"`. */
  path: string;
  /** Last-modified date in `YYYY-MM-DD` format. */
  lastmod?: string;
  /** Crawl-frequency hint — advisory, not binding. */
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Relative priority within the site, `"0.0"` – `"1.0"`. */
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      /**
       * Build an XML sitemap listing every public route. When a new
       * top-level route is added to the site, extend `entries` below.
       */
      GET: async () => {
        // `YYYY-MM-DD` slice of today's UTC date. Fresh on every request
        // — the CDN cache below is what keeps this cheap.
        const today = new Date().toISOString().slice(0, 10);

        // Every public, indexable route in the app.
        // Order in this array is preserved in the XML output.
        const entries: SitemapEntry[] = [
          { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
          { path: "/works", lastmod: today, changefreq: "weekly", priority: "0.8" },
        ];

        // Serialize each entry into a `<url>` block, skipping empty fields.
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        // Wrap the entries in a standard sitemap document.
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            // 1-hour edge cache — plenty for a site whose routes rarely change.
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
