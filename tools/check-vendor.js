// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Checks that every library copied into vendor/ is exactly the official
// release (AGENTS.md, "How the code is written"). For each library it
// compares every copied file, byte for byte, with the same file in the
// official package that `npm install` fetched at the exact version in
// package.json. A file that differs, is missing, or is extra fails the check,
// so nobody (a person or an AI agent) can change a library unnoticed.
// Run with: npm install && node tools/check-vendor.js   (exits with 1 on failure)
// @ts-check

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * One copied library: its folder in vendor/, its official npm package, the
 * exact version, and where each copied file comes from in that package.
 * @typedef {{dir: string, pkg: string, version: string, files: Record<string, string>}} Library
 */

/** @type {Library[]} Every library in vendor/. Add a new one here (skill adding-libraries). */
const LIBRARIES = [
  {
    dir: "vendor/leaflet-1.9.4",
    pkg: "leaflet",
    version: "1.9.4",
    files: {
      "leaflet.js": "dist/leaflet.js",
      "leaflet.css": "dist/leaflet.css",
      "images/layers.png": "dist/images/layers.png",
      "images/layers-2x.png": "dist/images/layers-2x.png",
      "images/marker-icon.png": "dist/images/marker-icon.png",
      "images/marker-icon-2x.png": "dist/images/marker-icon-2x.png",
      "images/marker-shadow.png": "dist/images/marker-shadow.png",
      "LICENSE": "LICENSE",
    },
  },
];

/**
 * Lists every file under a folder, as paths relative to that folder.
 * @param {string} dir
 * @returns {string[]}
 */
function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path).map((p) => join(name, p)) : [name];
  });
}

/**
 * The SHA-256 fingerprint of a file, as hex.
 * @param {string} path
 * @returns {string}
 */
function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/**
 * Finds the problems in one library.
 * @param {Library} lib
 * @returns {string[]}  One line per problem; empty when the copy is exact.
 */
function problemsIn(lib) {
  const pkgDir = join("node_modules", lib.pkg);
  if (!existsSync(pkgDir)) return [`${lib.pkg}: not installed; run npm install first`];
  const installed = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;
  if (installed !== lib.version) return [`${lib.pkg}: npm installed ${installed}, expected ${lib.version}`];

  const problems = [];
  const copied = listFiles(lib.dir).map((p) => relative(".", join(lib.dir, p)).slice(lib.dir.length + 1));
  for (const extra of copied.filter((p) => !(p in lib.files))) {
    problems.push(`${lib.dir}/${extra}: not part of the official package list`);
  }
  for (const [copy, official] of Object.entries(lib.files)) {
    const copyPath = join(lib.dir, copy);
    if (!existsSync(copyPath)) { problems.push(`${copyPath}: missing`); continue; }
    const mine = sha256(copyPath);
    const theirs = sha256(join(pkgDir, official));
    console.log(`${mine === theirs ? "same     " : "DIFFERENT"} ${copyPath}  ${mine}`);
    if (mine !== theirs) problems.push(`${copyPath}: differs from ${lib.pkg}@${lib.version}/${official} (official SHA-256 ${theirs})`);
  }
  return problems;
}

const problems = LIBRARIES.flatMap(problemsIn);
for (const line of problems) console.error(line);
console.log(`Checked ${LIBRARIES.length} library(ies): ${problems.length} problem(s).`);
process.exit(problems.length > 0 ? 1 : 0);
