// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The one gateway to Leaflet (DESIGN.md section 13.7). Leaflet 1.9 is loaded by
// index.html as a global script, which creates the global "L". This file is
// the only place that reads that global: it checks that Leaflet is there and is
// exactly the expected version, and exports it. Every other file imports it:
//
//   import { L, type Leaflet } from "./leaflet.ts";
//
// so where Leaflet comes from is visible in each file's imports, and the
// compiler refuses the global L anywhere else. When the app moves to
// Leaflet 2.0, which is imported like a normal module, only this file changes.

import type * as LeafletTypes from "leaflet";

/** Leaflet's types (L.Map, L.CircleMarker...), for type annotations: Leaflet.Map. */
export type * as Leaflet from "leaflet";

/** The exact Leaflet version the app is built and tested with (package.json, tools/build-site.ts). */
export const LEAFLET_VERSION = "1.9.4";

/**
 * Checks that a value is Leaflet at the expected version.
 *
 * @param value  Whatever the global "L" holds.
 * @returns  True if it is Leaflet LEAFLET_VERSION; the compiler then treats it as Leaflet.
 */
function isLeaflet(value: unknown): value is typeof LeafletTypes {
  return typeof value === "object" && value !== null &&
    "version" in value && value.version === LEAFLET_VERSION;
}

/**
 * Finds Leaflet, or stops the start-up with a clear error if index.html did
 * not load it, or loaded another version.
 *
 * @returns  Leaflet.
 */
function findLeaflet(): typeof LeafletTypes {
  const found: unknown = Reflect.get(globalThis, "L");
  if (!isLeaflet(found)) {
    throw new Error(`Leaflet ${LEAFLET_VERSION} is not loaded: index.html must load ` +
      `vendor/leaflet-${LEAFLET_VERSION}/leaflet.js before js/main.js`);
  }
  return found;
}

/** Leaflet: L.map(...), L.circle(...)... Checked once, when the app starts. */
export const L = findLeaflet();
