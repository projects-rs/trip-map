// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Assembles the folder site/, which is exactly what GitHub publishes and the
// phone downloads (DESIGN.md section 13.2). Run after the compiler, which has
// already written site/js/:   npm run build
//
//   site/index.html, site/css/   copied from the repository
//   site/js/                     compiled from src/ by the TypeScript compiler
//   site/vendor/<library>/       copied unchanged from each library's official
//                                npm package (skill adding-libraries)
//   site/version.json            the app's version, from package.json
//
// Each library's version is written in one place only: package.json
// (DESIGN.md section 13.7). This script checks that npm installed exactly that
// version, and that every other place that must agree with it does.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "site";

/** A library the app loads: its npm package, and the files the app needs from it. */
type Library = { pkg: string; files: string[] };

/** Every library the app loads. A file's "dist/" prefix is dropped in site/vendor/<pkg>/. */
const LIBRARIES: Library[] = [
  { pkg: "leaflet", files: ["dist/leaflet.js", "dist/leaflet.css", "dist/images", "LICENSE"] },
];

/** The app's own files, copied as they are. */
const APP_FILES = ["index.html", "css"];

/** Reads a JSON file and returns the value of one of its text fields, or stops with an error. */
function readJsonField(path: string, field: string): string {
  const data: unknown = JSON.parse(readFileSync(path, "utf8"));
  const value: unknown = typeof data === "object" && data !== null ? Reflect.get(data, field) : undefined;
  if (typeof value !== "string") throw new Error(`${path} has no "${field}"`);
  return value;
}

/**
 * The exact version of a package that package.json asks for (devDependencies),
 * after checking it is an exact version ("1.9.4", not "^1.9" or "latest").
 */
function wantedVersion(pkg: string): string {
  const manifest: unknown = JSON.parse(readFileSync("package.json", "utf8"));
  const deps: unknown =
    typeof manifest === "object" && manifest !== null ? Reflect.get(manifest, "devDependencies") : undefined;
  const version: unknown = typeof deps === "object" && deps !== null ? Reflect.get(deps, pkg) : undefined;
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`package.json must give ${pkg} an exact version like "1.9.4", not ${String(version)}`);
  }
  return version;
}

/**
 * Checks that npm installed exactly the version package.json asks for, then
 * copies the library's files unchanged into site/vendor/<pkg>/.
 *
 * @returns  The installed version.
 */
function copyLibrary(lib: Library): string {
  const pkgDir = join("node_modules", lib.pkg);
  if (!existsSync(pkgDir)) throw new Error(`${lib.pkg} is not installed: run npm install first`);
  const wanted = wantedVersion(lib.pkg);
  const installed = readJsonField(join(pkgDir, "package.json"), "version");
  if (installed !== wanted) {
    throw new Error(`npm installed ${lib.pkg} ${installed}, but package.json asks for ${wanted}: run npm install`);
  }
  const target = join(SITE, "vendor", lib.pkg);
  for (const file of lib.files) {
    cpSync(join(pkgDir, file), join(target, file.replace(/^dist\//, "")), { recursive: true });
  }
  console.log(`copied ${lib.pkg} ${installed} → ${target}`);
  return installed;
}

/**
 * Checks the places that must agree with Leaflet's version in package.json:
 * the start-up check in src/leaflet.ts, and Leaflet's type descriptions
 * (@types/leaflet), whose major.minor version must be Leaflet's.
 */
function checkLeafletVersion(version: string): void {
  const source = readFileSync(join("src", "leaflet.ts"), "utf8");
  const match = /export const LEAFLET_VERSION = "([^"]+)";/.exec(source);
  if (match === null || match[1] !== version) {
    throw new Error(
      `src/leaflet.ts checks for Leaflet ${String(match?.[1])}, but package.json asks for ${version}: ` +
        `set LEAFLET_VERSION = "${version}" in src/leaflet.ts`,
    );
  }
  const types = wantedVersion("@types/leaflet");
  const majorMinor = (v: string): string => v.split(".").slice(0, 2).join(".");
  if (majorMinor(types) !== majorMinor(version)) {
    throw new Error(
      `@types/leaflet ${types} describes another Leaflet than ${version}: use a ${majorMinor(version)}.x version`,
    );
  }
}

if (!existsSync(join(SITE, "js", "main.js"))) {
  throw new Error("site/js/main.js is missing: run the compiler (tsc) first");
}
mkdirSync(SITE, { recursive: true });
for (const file of APP_FILES) cpSync(file, join(SITE, file), { recursive: true });
for (const lib of LIBRARIES) {
  const version = copyLibrary(lib);
  if (lib.pkg === "leaflet") checkLeafletVersion(version);
}

// The app's own version (DESIGN.md section 11.3), written in one place,
// package.json, and copied here for Settings and the update check.
const appVersion = readJsonField("package.json", "version");
writeFileSync(join(SITE, "version.json"), JSON.stringify({ version: appVersion }) + "\n");
console.log(`app version ${appVersion} → site/version.json`);
console.log("site/ is ready");
