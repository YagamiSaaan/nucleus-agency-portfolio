/**
 * @file src/server.ts
 *
 * Serverless entry point for the app. Wired in via
 * `vite.config.ts`'s `tanstackStart.server.entry = "server"` override
 * so this file — not the default TanStack Start bundle — receives every
 * incoming request.
 *
 * ## Responsibilities
 * 1. Import the TanStack Start SSR handler *lazily* so a module-init
 *    throw becomes catchable instead of taking down the entire worker.
 * 2. Wrap the handler in `try/catch` for thrown errors.
 * 3. Post-process the handler's response for the h3 "swallowed error"
 *    signature (see {@link normalizeCatastrophicSsrResponse}).
 * 4. Fall back to a self-contained HTML error page on any failure so
 *    users never see a raw JSON `{"unhandled":true,...}` body.
 *
 * See the `tanstack-ssr-error-handling` knowledge card for the full
 * design rationale behind this five-layer setup.
 */
import "./lib/error-capture"; // side-effect import: arms globalThis listeners

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

/** Shape of the lazily-loaded TanStack Start server handler. */
type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

/**
 * Cached import promise. Doing this once per worker instance avoids
 * repeatedly resolving the same module while still keeping the import
 * itself inside `try/catch`.
 */
let serverEntryPromise: Promise<ServerEntry> | undefined;

/**
 * Lazily import the bundled TanStack Start SSR handler. The `import()`
 * happens inside `fetch()` so any module-init failure surfaces as a
 * catchable rejected promise rather than a top-level crash.
 */
async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      // Some bundlers give us `{ default: handler }`, others give us the
      // handler directly — accept both shapes.
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

/**
 * Detect and repair the h3-swallowed-error case.
 *
 * When something throws inside a route handler, h3 catches it and
 * returns a normal `Response` with:
 * - status ≥ 500
 * - `content-type: application/json`
 * - body `{"unhandled": true, "message": "HTTPError"}`
 *
 * The wrapper's `try/catch` never fires because a `Response` is
 * returned normally. Here we sniff for that exact signature, log the
 * out-of-band captured error (see `error-capture.ts`) so the stack
 * reaches Server Logs, and replace the ugly JSON with our HTML
 * fallback.
 *
 * Non-JSON, non-500 responses pass through untouched.
 */
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  // `.clone()` so the response body can still be read once we bail on it.
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  // Recover the original stack via the globalThis capture, or fall back
  // to a synthetic Error carrying just the h3 body text.
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * Return `true` when `body` is exactly the JSON payload h3 emits when
 * it internally caught an in-handler throw. We match on structure, not
 * substring, so unrelated JSON errors are left alone.
 */
function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    // Not JSON → definitely not the h3 signature.
    return false;
  }
}

/**
 * Cloudflare/edge-worker style default export. `fetch()` is invoked for
 * every request. All work is wrapped in `try/catch`; the HTML fallback
 * guarantees the client always gets a renderable page.
 */
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      // Log the raw Error (not `error.message`) to preserve `.stack`.
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
