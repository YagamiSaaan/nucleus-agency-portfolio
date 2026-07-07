/**
 * @file src/start.ts
 *
 * TanStack Start configuration. Registers per-request middleware that
 * runs during SSR and API-route dispatch.
 *
 * The single middleware here is an app-level error safety net: it
 * catches any throw that escapes a route handler and swaps in our
 * HTML fallback page instead of letting h3 emit its default JSON 500.
 * `Response`-shaped throws (i.e. errors already carrying a
 * `statusCode` — TanStack's `notFound()`, `redirect()`, etc.) are
 * re-thrown untouched so the framework can handle them normally.
 */
import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

/**
 * Server-side middleware wrapping every request in try/catch.
 *
 * Behaviour:
 * - Framework-thrown control-flow errors (anything with `statusCode`)
 *   are rethrown so TanStack Start can turn them into redirects or
 *   not-found responses.
 * - Anything else is logged (preserving `.stack`) and a 500 HTML
 *   response is returned to the client.
 */
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // Preserve control-flow errors: redirect(), notFound(), etc.
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * TanStack Start instance. `requestMiddleware` runs for every incoming
 * request (both SSR renders and server-route API calls) before the
 * matched handler.
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
