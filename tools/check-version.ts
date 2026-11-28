// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Checks, on every pull request, that a change to the app raises the app's
// version (DESIGN.md section 11.3): each merge that changes the app becomes a
// release with its own version. A pull request that changes only documents or
// tests may keep the version.
//
// Run with: node tools/check-version.ts <base>   (exits with 1 on failure)
// where <base> is the commit the pull request will be merged into, for
// example "origin/main". The GitHub workflow fetches it first.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/** The files and folders whose change means the app changed, and so needs a new version. */
const APP_PATHS = ["src", "index.html", "css", "icons", "package.json", "tsconfig.json", "tools/build-site.ts"];

/** Runs git with these arguments and returns what it prints. */
function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

/** The "version" field of a package.json text, or "0.0.0" if it has none. */
function versionIn(packageJson: string): string {
  const data: unknown = JSON.parse(packageJson);
  const version: unknown = typeof data === "object" && data !== null ? Reflect.get(data, "version") : undefined;
  return typeof version === "string" ? version : "0.0.0";
}

/** Splits "1.2.3" into [1, 2, 3], or stops if it is not in that form. */
function parts(version: string): [number, number, number] {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (match === null) throw new Error(`"${version}" is not a version like 1.2.3`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** True if version a is higher than version b (compares major, then minor, then patch). */
function isHigher(a: string, b: string): boolean {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return (x[i] ?? 0) > (y[i] ?? 0);
  }
  return false;
}

const base = process.argv[2];
if (base === undefined) throw new Error("usage: node tools/check-version.ts <base commit>");

const changed = git("diff", "--name-only", base, "HEAD", "--", ...APP_PATHS).trim();
const current = versionIn(readFileSync("package.json", "utf8"));
let previous = "0.0.0";
try {
  previous = versionIn(git("show", `${base}:package.json`));
} catch {
  // The base has no package.json yet (before the first app code): any version is new.
}

if (changed === "") {
  console.log(`The app is unchanged (documents or tests only): version ${current} may stay.`);
} else if (isHigher(current, previous)) {
  console.log(`The app changed, and its version rises from ${previous} to ${current}.`);
} else {
  console.error(`The app changed (${changed.split("\n").join(", ")}), but its version is still ${current}.`);
  console.error(
    `Raise "version" in package.json above ${previous}: a patch for a fix, the minor for a feature (DESIGN.md section 11.3).`,
  );
  process.exit(1);
}
