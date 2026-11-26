// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Assembles the folder site/, which is exactly what GitHub publishes and the
// phone downloads (DESIGN.md section 13.2). Run after the compiler, which has
// already written site/js/:   npm run build
//
//   site/index.html, site/css/       copied from the repository
//   site/js/                         compiled from src/ by the TypeScript compiler
//   site/vendor/<library>-<version>/ copied unchanged from each library's
//                                    official npm package (skill adding-libraries)

import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "site";

/** A library the app loads: its npm package, exact version, and the files the app needs. */
type Library = { pkg: string; version: string; files: string[] };

/** Every library the app loads. Each file keeps its path inside the package's dist/ folder. */
const LIBRARIES: Library[] = [
  {
    pkg: "leaflet",
    version: "1.9.4",
    files: ["dist/leaflet.js", "dist/leaflet.css", "dist/images", "LICENSE"],
  },
];

/** The app's own files, copied as they are. */
const APP_FILES = ["index.html", "css"];

/**
 * Copies one library's files from node_modules into site/vendor/<pkg>-<version>/,
 * after checking that npm installed exactly the expected version.
 */
function copyLibrary(lib: Library): void {
  const pkgDir = join("node_modules", lib.pkg);
  const manifest = join(pkgDir, "package.json");
  if (!existsSync(manifest)) throw new Error(`${lib.pkg} is not installed: run npm install first`);
  const installed: unknown = JSON.parse(readFileSync(manifest, "utf8")).version;
  if (installed !== lib.version) {
    throw new Error(`npm installed ${lib.pkg} ${String(installed)}, but the app needs exactly ${lib.version}`);
  }
  const target = join(SITE, "vendor", `${lib.pkg}-${lib.version}`);
  for (const file of lib.files) {
    // "dist/images" → "images": the app refers to files without the dist/ prefix.
    const name = file.replace(/^dist\//, "");
    cpSync(join(pkgDir, file), join(target, name), { recursive: true });
  }
  console.log(`copied ${lib.pkg} ${lib.version} → ${target}`);
}

if (!existsSync(join(SITE, "js", "main.js"))) {
  throw new Error("site/js/main.js is missing: run the compiler (tsc) first");
}
mkdirSync(SITE, { recursive: true });
for (const file of APP_FILES) cpSync(file, join(SITE, file), { recursive: true });
for (const lib of LIBRARIES) copyLibrary(lib);
console.log("site/ is ready");
