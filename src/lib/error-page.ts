/**
 * @file src/lib/error-page.ts
 *
 * A self-contained HTML error page for catastrophic SSR failures.
 *
 * ## Design constraints
 * This module is the *last-resort* fallback: it is served when the app
 * cannot render its own React tree (root route throw, module-init
 * failure, h3-swallowed 500). It therefore MUST NOT import anything
 * from the app — if it did, the same failure that triggered this
 * fallback could break the fallback itself.
 *
 * The HTML uses system fonts and inline CSS so it has zero external
 * dependencies and renders instantly, even without JS or network.
 */

/**
 * Return a complete `<!doctype html>` document describing a friendly
 * "something went wrong" page with two actions: refresh, and go home.
 *
 * The returned string is intended to be passed to `new Response()` with
 * `Content-Type: text/html; charset=utf-8`.
 */
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
