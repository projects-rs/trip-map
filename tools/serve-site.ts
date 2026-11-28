// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Serves the built site/ folder on this computer, the way GitHub Pages serves
// it, for the phone tests and for trying the app in a browser. Written with
// Node's own modules only, so it runs wherever the project builds (Windows,
// Mac, Linux) with nothing else installed.
//
// Usage: node tools/serve-site.ts [port]      (default port 8000)
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const SITE = resolve("site");
const HOST = "127.0.0.1"; // this computer only, never the network

// The file types the site holds, and the type the browser must be told for each.
const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * Turns the path of a request into a file inside site/.
 * Receives the request's URL path, such as "/js/main.js" or "/".
 * Returns the file's full path, or null if the path would leave site/
 * (for example "/../package.json"), so nothing outside site/ is ever sent.
 * Throws if the path is not valid percent-encoding (for example "/%E0").
 */
function fileFor(urlPath: string): string | null {
  const path = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const file = resolve(SITE, "." + (path.endsWith("/") ? path + "index.html" : path));
  return file.startsWith(SITE + sep) ? file : null;
}

/**
 * Answers one request from the browser with the file it asks for.
 * Receives the request and the response to fill in.
 * Returns when the answer is sent: the file, or 404 if there is none.
 */
async function answer(request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    // Inside try: a malformed address (such as "/%E0") makes fileFor throw,
    // and must get a 404, not stop the server.
    const file = fileFor(request.url ?? "/");
    if (file === null) throw new Error("outside site/");
    const body = await readFile(file);
    const type = CONTENT_TYPES[extname(file)] ?? "application/octet-stream";
    response.writeHead(200, { "Content-Type": type }).end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}

const port = Number(process.argv[2] ?? "8000");
createServer((request, response) => void answer(request, response)).listen(port, HOST, () => {
  console.log(`Serving site/ at http://localhost:${port}/  (Ctrl+C to stop)`);
});
