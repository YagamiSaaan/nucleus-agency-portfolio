/**
 * @file src/lib/error-capture.ts
 *
 * Out-of-band error capture for the SSR pipeline.
 *
 * ## Why this exists
 * TanStack Start uses h3 under the hood. When an in-handler throw happens,
 * h3 catches it internally and returns a normal `Response` with status 500
 * and body `{"unhandled":true,"message":"HTTPError"}`. Because the throw
 * never bubbles out, the `try/catch` in `src/server.ts` never fires and
 * the original `Error` — including its stack — is lost.
 *
 * As a workaround we install `globalThis` listeners for the two events
 * that fire *before* h3 swallows the throw: `error` (synchronous throws)
 * and `unhandledrejection` (rejected promises). The most recent one is
 * cached with a short TTL and read back by `server.ts` when it detects
 * the tell-tale h3 body, so real stacks reach the Server Logs.
 *
 * Importing this file for its side effect at the top of `src/server.ts`
 * is what arms the listeners.
 */

/** Most recent captured error, with the millisecond timestamp of capture. */
let lastCapturedError: { error: unknown; at: number } | undefined;

/**
 * How long a captured error stays "fresh". Anything older than this is
 * assumed to be unrelated to the current request. 5 s is comfortably
 * larger than a typical SSR round-trip but short enough to avoid
 * cross-request contamination.
 */
const TTL_MS = 5_000;

/** Stash the most recent error along with a timestamp. */
function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// Guarded so this module is safe to import in test environments that
// don't provide a global event target.
if (typeof globalThis.addEventListener === "function") {
  // Synchronous throws in server handlers / module init.
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  // Rejected promises that no one awaited.
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

/**
 * Read the most recently captured error and clear it. Returns `undefined`
 * when nothing was captured or when the capture is older than {@link TTL_MS}
 * (stale — probably from a previous request).
 *
 * The one-shot semantics matter: two overlapping 500s shouldn't both blame
 * the same captured error.
 */
export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
