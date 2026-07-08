/**
 * @file src/routes/__root.tsx
 *
 * The root route of the app. Every other route renders inside this
 * shell, so anything defined here — head tags, providers, error
 * boundaries — applies site-wide.
 *
 * ## Responsibilities
 * - Ship the base HTML document (`<html>`/`<head>`/`<body>`).
 * - Load global CSS and the Google Fonts stylesheet.
 * - Emit sitewide `<meta>` and Organization JSON-LD.
 * - Provide the TanStack Query client to the tree.
 * - Own the app-level 404 and error boundaries.
 *
 * Route-specific metadata (title, description, canonical, og:image,
 * per-page JSON-LD) lives on each leaf route's `head()` — see
 * `src/routes/index.tsx` and `src/routes/works.tsx`.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

/**
 * Fallback rendered when the router matches no route (a 404).
 *
 * Registered via `notFoundComponent` on the root route so that any
 * unmatched URL — including deep, nested paths — lands here rather
 * than throwing.
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * React error boundary for the whole app.
 *
 * When any component throws during render or a loader errors, this
 * component is mounted in place of the crashed subtree. It:
 * 1. Logs the raw `Error` (preserving `.stack`) so it reaches Server Logs.
 * 2. Forwards the error to the Lovable runtime for platform-level tracking.
 * 3. Offers "Try again" (which invalidates the router cache and resets
 *    the boundary so the loader re-runs) and "Go home" (a hard nav).
 *
 * `reset()` alone would clear the boundary state but not re-run the
 * loader — we call `router.invalidate()` first to force fresh data.
 */
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              // Invalidate first so the loader re-runs on retry — a bare
              // `reset()` would just remount the crashed component with
              // its stale (broken) data.
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Root route definition.
 *
 * `createRootRouteWithContext<{ queryClient: QueryClient }>()` declares
 * the shape of the context threaded through every child loader; the
 * actual value is supplied by `getRouter()` in `src/router.tsx`.
 *
 * ## head()
 * Only sitewide defaults live here — per-page `title`, `description`,
 * `canonical`, `og:image`, and page-specific JSON-LD belong on each
 * leaf route. Placing them here would override the child values.
 */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5" },
      { name: "author", content: "Nucleus" },
      // og:site_name applies to every share preview.
      { property: "og:site_name", content: "Nucleus" },
      // Default og:type; leaf routes may override (e.g. "article").
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        // Organization JSON-LD — sitewide entity schema for search
        // engines and social crawlers. Update when contact details
        // or social profiles change.
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nucleus",
          url: "https://snuggle-bright-flow.lovable.app",
          logo: "https://snuggle-bright-flow.lovable.app/__l5e/assets-v1/543eff37-76c7-48cf-a21a-2cb7412c3ae4/nucleus-og.jpg",
          foundingDate: "2026",
          description:
            "A two-person studio building high-end websites and motion ads.",
          email: "nucleus.devsupport@gmail.com",
          sameAs: ["https://instagram.com/nucleus.xyz"],
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "nucleus.devsupport@gmail.com",
              telephone: "+91-95673-32494",
            },
          ],
        }),
      },
    ],
    links: [
      // Global stylesheet (Tailwind base + custom animations).
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Preconnect to the Google Fonts domains so the actual font
      // request can start as soon as the stylesheet resolves.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Font weights are trimmed to only the ones actually used in the
      // app — see the perf pass in the change history for details.
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Bare HTML shell rendered around the app on both server and client.
 *
 * `suppressHydrationWarning` on the three top-level elements silences
 * the noisy React dev warning caused by Lovable's editor injecting
 * `data-tsd-source` attributes and by browser extensions (Bitdefender,
 * password managers) mutating `<body>` before hydration. These are
 * dev-only markers with no runtime effect.
 */
function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root React tree. Wraps everything in the `QueryClientProvider` so
 * `useSuspenseQuery` / `useQuery` in any child route can share the
 * per-request `QueryClient` created by `getRouter()`.
 *
 * `<Outlet />` is mandatory — it's the mount point for whatever child
 * route matched. Removing it renders a blank page even though the URL
 * still resolves.
 */
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
