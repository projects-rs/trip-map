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
 * The "My location" button: a state machine driven by taps, GPS positions,
 * GPS errors, and drags of the map.
 *
 * A tap moves the mode one step: off → waiting (→ shown at the first position,
 * with the map centered on the dot) → follow. A tap while following centers
 * the map again. Dragging the map stops following, so the user can look around.
 *
 * Methods that the browser or Leaflet call back (the on... methods) are
 * arrow-function fields, so they always keep "this" (AGENTS.md).
 */
export class MyLocation {
  /** @type {Mode} */
  #mode = "off";
  /** @type {number | null} The id of the running location watch, to stop it later. */
  #watchId = null;
  /** @type {any} The blue dot, created at the first position. */
  #dot = null;
  /** @type {any} The pale circle showing how accurate the position is. */
  #accuracyCircle = null;

  /** @type {any} The Leaflet map. */
  #map;
  /** @type {HTMLButtonElement} */
  #button;
  /** @type {(text: string) => void} */
  #showMessage;
  /** @type {Geolocation} */
  #geolocation;

  /**
   * Connects the "My location" button to the phone's location and the map.
   *
   * @param {any} map  The Leaflet map, from createMap().
   * @param {HTMLButtonElement} button  The "My location" button.
   * @param {(text: string) => void} showMessage  Shows a short message to the user.
   * @param {Geolocation} [geolocation]  The phone's location service; the browser's by default.
   */
  constructor(map, button, showMessage, geolocation = navigator.geolocation) {
    this.#map = map;
    this.#button = button;
    this.#showMessage = showMessage;
    this.#geolocation = geolocation;

    button.addEventListener("click", this.onTap);
    // A drag by the user's finger (not a move made by the code) stops following.
    map.on("dragstart", this.onDragStart);
  }

  /** @returns {Mode} The current mode. */
  get mode() {
    return this.#mode;
  }

  /**
   * Changes the mode, and shows it on the button for the styles, the tests,
   * and screen readers.
   * @param {Mode} newMode
   */
  #setMode(newMode) {
    this.#mode = newMode;
    this.#button.dataset.mode = newMode;
    this.#button.setAttribute("aria-pressed", String(newMode === "follow"));
  }

  /** Called by the browser on a tap of the button. */
  onTap = () => {
    if (this.#mode === "off") {
      this.#setMode("waiting");
      // The first call is what makes the phone ask for permission.
      this.#watchId = this.#geolocation.watchPosition(this.onPosition, this.onError, {
        enableHighAccuracy: true,   // use GPS, not only Wi-Fi, for walking
        maximumAge: 5000,           // a position up to 5 seconds old is fine
      });
    } else if (this.#mode === "shown" || this.#mode === "follow") {
      this.#map.setView(this.#dot.getLatLng(), this.#map.getZoom());
      this.#setMode("follow");
    }
    // In "waiting", a tap does nothing: the first position is on its way.
  };

  /**
   * Called by the browser each time the phone has a new position.
   * @param {GeolocationPosition} position
   */
  onPosition = (position) => {
    const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
    if (this.#dot === null) {
      this.#accuracyCircle = L.circle(latLng, {
        radius: position.coords.accuracy,
        stroke: false, fillColor: "#1a73e8", fillOpacity: 0.15, interactive: false,
      }).addTo(this.#map);
      this.#dot = L.circleMarker(latLng, {
        radius: 8, weight: 3, color: "#ffffff", fillColor: "#1a73e8", fillOpacity: 1,
        className: "blue-dot", interactive: false,
      }).addTo(this.#map);
    } else {
      this.#dot.setLatLng(latLng);
      this.#accuracyCircle.setLatLng(latLng).setRadius(position.coords.accuracy);
    }

    if (this.#mode === "waiting") {
      this.#map.setView(latLng, Math.max(this.#map.getZoom(), STREET_ZOOM));
      this.#setMode("shown");
    } else if (this.#mode === "follow") {
      this.#map.panTo(latLng);
    }
  };

  /**
   * Called by the browser when it cannot give a position.
   * @param {GeolocationPositionError} error
   */
  onError = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      this.#stopWatching();
      this.#removeDot();          // an old position must not stay on the map
      this.#setMode("off");
      this.#showMessage(MSG_DENIED);
    } else if (this.#mode === "waiting") {
      // No signal or a timeout: the watch keeps running and may still succeed.
      this.#showMessage(MSG_NOT_FOUND);
    }
  };

  /** Called by Leaflet when a finger starts dragging the map. */
  onDragStart = () => {
    if (this.#mode === "follow") this.#setMode("shown");
  };

  /** Stops the location watch, if one is running. */
  #stopWatching() {
    if (this.#watchId !== null) {
      this.#geolocation.clearWatch(this.#watchId);
      this.#watchId = null;
    }
  }

  /** Takes the blue dot and its circle off the map, if they are there. */
  #removeDot() {
    if (this.#dot !== null) {
      this.#dot.remove();
      this.#accuracyCircle.remove();
      this.#dot = null;
      this.#accuracyCircle = null;
    }
  }
}
