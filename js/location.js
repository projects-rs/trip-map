// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The "My location" button and the blue dot (DESIGN.md section 4.2, control UI-08).
// The phone asks for location permission only when the user first taps the
// button, never earlier (DESIGN.md section 3.1).
// @ts-check

/** Leaflet, which index.html loads before this module as the global "L". */
const L = /** @type {any} */ (window).L;

/** Zoom used when the map first centers on the user: about one street block. */
const STREET_ZOOM = 16;

/** Shown when the user, or the phone's settings, refused location. */
export const MSG_DENIED =
  "Location is off for Trip Map. To use it, allow location for this site in your browser's settings.";

/** Shown when the phone cannot find a position yet; it keeps trying. */
export const MSG_NOT_FOUND =
  "Can't find your location yet. The blue dot will appear when the phone finds it.";

/**
 * The button's modes, kept in its data-mode attribute so that the styles
 * and the tests can see it:
 *   "off"     location not used
 *   "waiting" the user tapped; waiting for the first position
 *   "shown"   the blue dot is on the map; the map does not move by itself
 *   "follow"  the map keeps the blue dot in its center while the user walks
 * @typedef {"off" | "waiting" | "shown" | "follow"} Mode
 */

/**
 * Connects the "My location" button to the phone's location and the map.
 *
 * A tap moves the mode one step: off → waiting (→ shown at the first position,
 * with the map centered on the dot) → follow. A tap while following centers
 * the map again. Dragging the map stops following, so the user can look around.
 *
 * @param {any} map  The Leaflet map, from createMap().
 * @param {HTMLButtonElement} button  The "My location" button.
 * @param {(text: string) => void} showMessage  Shows a short message to the user.
 * @param {Geolocation} [geolocation]  The phone's location service; the browser's by default.
 * @returns {{mode: () => Mode}}  A way to read the current mode.
 */
export function setUpMyLocation(map, button, showMessage, geolocation = navigator.geolocation) {
  /** @type {Mode} */
  let mode = "off";
  /** @type {number | null} The id of the running location watch, to stop it later. */
  let watchId = null;
  /** @type {any} The blue dot, created at the first position. */
  let dot = null;
  /** @type {any} The pale circle showing how accurate the position is. */
  let accuracyCircle = null;

  /** @param {Mode} newMode */
  function setMode(newMode) {
    mode = newMode;
    button.dataset.mode = newMode;
    button.setAttribute("aria-pressed", String(newMode === "follow"));
  }

  /**
   * Called by the browser each time the phone has a new position.
   * @param {GeolocationPosition} position
   */
  function onPosition(position) {
    const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
    if (dot === null) {
      accuracyCircle = L.circle(latLng, {
        radius: position.coords.accuracy,
        stroke: false, fillColor: "#1a73e8", fillOpacity: 0.15, interactive: false,
      }).addTo(map);
      dot = L.circleMarker(latLng, {
        radius: 8, weight: 3, color: "#ffffff", fillColor: "#1a73e8", fillOpacity: 1,
        className: "blue-dot", interactive: false,
      }).addTo(map);
    } else {
      dot.setLatLng(latLng);
      accuracyCircle.setLatLng(latLng).setRadius(position.coords.accuracy);
    }

    if (mode === "waiting") {
      map.setView(latLng, Math.max(map.getZoom(), STREET_ZOOM));
      setMode("shown");
    } else if (mode === "follow") {
      map.panTo(latLng);
    }
  }

  /**
   * Called by the browser when it cannot give a position.
   * @param {GeolocationPositionError} error
   */
  function onError(error) {
    if (error.code === error.PERMISSION_DENIED) {
      stopWatching();
      setMode("off");
      showMessage(MSG_DENIED);
    } else if (mode === "waiting") {
      // No signal or a timeout: the watch keeps running and may still succeed.
      showMessage(MSG_NOT_FOUND);
    }
  }

  function stopWatching() {
    if (watchId !== null) {
      geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  button.addEventListener("click", () => {
    if (mode === "off") {
      setMode("waiting");
      // The first call is what makes the phone ask for permission.
      watchId = geolocation.watchPosition(onPosition, onError, {
        enableHighAccuracy: true,   // use GPS, not only Wi-Fi, for walking
        maximumAge: 5000,           // a position up to 5 seconds old is fine
      });
    } else if (mode === "shown" || mode === "follow") {
      map.setView(dot.getLatLng(), map.getZoom());
      setMode("follow");
    }
    // In "waiting", a tap does nothing: the first position is on its way.
  });

  // A drag by the user's finger (not a move made by the code) stops following.
  map.on("dragstart", () => {
    if (mode === "follow") setMode("shown");
  });

  return { mode: () => mode };
}
