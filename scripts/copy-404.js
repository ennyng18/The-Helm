// GitHub Pages has no server-side routing: any deep link (e.g. /boards/customers)
// or page refresh on a non-root route returns a 404 from GitHub's static host
// before React Router ever runs. The standard fix is to also publish a 404.html
// that is just a copy of index.html — GitHub serves it for any unmatched path,
// the app boots, and React Router (using the URL) renders the right screen.
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");
const indexHtml = resolve(dist, "index.html");
const notFoundHtml = resolve(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.error("dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log("Copied dist/index.html -> dist/404.html for GitHub Pages SPA fallback.");
