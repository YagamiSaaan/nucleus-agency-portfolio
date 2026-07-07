/**
 * @file src/router.tsx
 *
 * Builds the TanStack Router instance used by both the client (via
 * `src/start.ts` → `StartClient`) and the SSR handler.
 *
 * A fresh `QueryClient` is created per-request (per `getRouter()` call) so
 * that server renders never leak cache between users. On the client this
 * function runs once at hydration.
 */
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * Construct a router + its query-client context.
 *
 * Called by TanStack Start on the client at hydration and on the server
 * for every incoming request. Must return a *new* router each call so
 * concurrent requests never share state.
 *
 * `defaultPreloadStaleTime: 0` — always re-run loaders on preload, so
 * data shown after `<Link>` hover matches what a hard-navigation would
 * fetch. `scrollRestoration: true` — restore scroll position on
 * back/forward navigation.
 */
export const getRouter = () => {
  // Per-request cache; safe on the server, single-instance on the client.
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // `context` is threaded into every `loader`, `beforeLoad`, and
    // `Route.useRouteContext()` call — see `tanstack-type-safety`.
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
