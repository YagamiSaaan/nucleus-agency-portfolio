/**
 * @file src/lib/lovable-error-reporting.ts
 *
 * Thin bridge between our app-side error boundaries and the Lovable
 * runtime's `window.__lovableEvents.captureException` hook. Whenever
 * the platform is present (i.e. in the Lovable preview/published site),
 * errors we catch here surface in the platform's error UI.
 *
 * Safe to call from any React error boundary or `errorComponent`. In a
 * non-Lovable environment this is a no-op.
 */

/**
 * Metadata the Lovable runtime uses to categorize a captured error.
 * Mirrors the Sentry-style envelope its capture hook expects.
 */
type LovableErrorOptions = {
  /** How the error reached us. */
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  /** `true` when we intentionally caught and recovered; `false` for crashes. */
  handled?: boolean;
  /** Severity of the report; defaults to `"error"`. */
  severity?: "error" | "warning" | "info";
};

/** Shape of the Lovable runtime's error-capture hook when present. */
type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

// The Lovable runtime injects `window.__lovableEvents` into the page.
declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

/**
 * Forward an error to the Lovable runtime.
 *
 * @param error - The thrown value; usually an `Error`, but any value is
 *   accepted (the platform normalizes).
 * @param context - Extra context merged into the capture payload
 *   (e.g. `{ boundary: "tanstack_root_error_component" }`).
 *
 * No-op during SSR (`typeof window === "undefined"`) and no-op when the
 * Lovable runtime is not present (e.g. self-hosted deploy).
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
