// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Creates the full-screen map with OpenStreetMap's street map
// (DESIGN.md sections 3 and 4, build step 1).

import { L, type Leaflet } from "./leaflet.ts";

/** OpenStreetMap's tile server: light use only, no bulk downloading (DESIGN.md section 14.1). */
export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/** The credit OpenStreetMap's license requires on the map (DESIGN.md section 14.1). */
export const OSM_CREDIT =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/**
 * Where the map starts before any trip is open: the Mediterranean,
 * zoomed out far enough to show Israel and Spain.
 */
export const START_VIEW: { center: Leaflet.LatLngTuple; zoom: number } = { center: [38, 15], zoom: 4 };

/**
 * Creates the map inside an element of the page.
 *
 * @param elementId  The id of the element the map fills, for example "map".
 * @returns  The Leaflet map.
 */
export function createMap(elementId: string): Leaflet.Map {
  const map = L.map(elementId, {
    // No + and − buttons: on a phone the map is zoomed by pinching.
    zoomControl: false,
  }).setView(START_VIEW.center, START_VIEW.zoom);

  L.tileLayer(TILE_URL, {
    maxZoom: 19,              // the highest zoom OpenStreetMap's server provides
    attribution: OSM_CREDIT,
  }).addTo(map);

  // Credit Leaflet as a plain link (its default credit also shows a flag icon).
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');

  return map;
}
