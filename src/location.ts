// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The "My location" button and the blue dot (DESIGN.md section 4.2, control UI-08).
// The phone asks for location permission only when the user first taps the
// button, never earlier (DESIGN.md section 3.1).

import { L, type Leaflet } from "./leaflet.ts";

/** Zoom used when the map first centers on the user: about one street block. */
const STREET_ZOOM = 16;

/** Shown when the user, or the phone's settings, refused location. */
export const MSG_DENIED =
  "Location is off for Trip Map. To use it, allow location for this site in your browser's settings.";

/** Shown when the phone cannot find a position yet; it keeps trying. */
export const MSG_NOT_FOUND = "Can't find your location yet. The blue dot will appear when the phone finds it.";

/**
 * The button's modes, kept in its data-mode attribute so that the styles
 * and the tests can see it:
 *   "off"     location not used
 *   "waiting" the user tapped; waiting for the first position
 *   "shown"   the blue dot is on the map; the map does not move by itself
 *   "follow"  the map keeps the blue dot in its center while the user walks
 */
export type Mode = "off" | "waiting" | "shown" | "follow";

/** The blue dot and its accuracy circle, which always exist together. */
type Marker = { dot: Leaflet.CircleMarker; circle: Leaflet.Circle };

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
  private mode: Mode = "off";
  /** The id of the running location watch, to stop it later; null when none runs. */
  private watchId: number | null = null;
  /** The blue dot and its circle; null until the first position. */
  private marker: Marker | null = null;

  /**
   * Connects the "My location" button to the phone's location and the map.
   *
   * @param map  The Leaflet map, from createMap().
   * @param button  The "My location" button.
   * @param showMessage  Shows a short message to the user.
   * @param geolocation  The phone's location service; the browser's by default.
   */
  constructor(
    private readonly map: Leaflet.Map,
    private readonly button: HTMLButtonElement,
    private readonly showMessage: (text: string) => void,
    private readonly geolocation: Geolocation = navigator.geolocation,
  ) {
    button.addEventListener("click", this.onTap);
    // A drag by the user's finger (not a move made by the code) stops following.
    map.on("dragstart", this.onDragStart);
  }

  /** The current mode. */
  get currentMode(): Mode {
    return this.mode;
  }

  /** Called by the browser on a tap of the button. */
  private readonly onTap = (): void => {
    if (this.mode === "off") {
      this.setMode("waiting");
      // The first call is what makes the phone ask for permission.
      this.watchId = this.geolocation.watchPosition(this.onPosition, this.onError, {
        enableHighAccuracy: true, // use GPS, not only Wi-Fi, for walking
        maximumAge: 5000, // a position up to 5 seconds old is fine
      });
    } else if (this.marker !== null) {
      // "shown" or "follow": center on the dot, and follow from now on.
      this.map.setView(this.marker.dot.getLatLng(), this.map.getZoom());
      this.setMode("follow");
    }
    // In "waiting", a tap does nothing: the first position is on its way.
  };

  /** Called by the browser each time the phone has a new position. */
  private readonly onPosition = (position: GeolocationPosition): void => {
    const latLng = L.latLng(position.coords.latitude, position.coords.longitude);
    if (this.marker === null) {
      this.marker = {
        circle: L.circle(latLng, {
          radius: position.coords.accuracy,
          stroke: false,
          fillColor: "#1a73e8",
          fillOpacity: 0.15,
          interactive: false,
        }).addTo(this.map),
        dot: L.circleMarker(latLng, {
          radius: 8,
          weight: 3,
          color: "#ffffff",
          fillColor: "#1a73e8",
          fillOpacity: 1,
          className: "blue-dot",
          interactive: false,
        }).addTo(this.map),
      };
    } else {
      this.marker.dot.setLatLng(latLng);
      this.marker.circle.setLatLng(latLng).setRadius(position.coords.accuracy);
    }

    if (this.mode === "waiting") {
      this.map.setView(latLng, Math.max(this.map.getZoom(), STREET_ZOOM));
      this.setMode("shown");
    } else if (this.mode === "follow") {
      this.map.panTo(latLng);
    }
  };

  /** Called by the browser when it cannot give a position. */
  private readonly onError = (error: GeolocationPositionError): void => {
    if (error.code === error.PERMISSION_DENIED) {
      this.stopWatching();
      this.removeMarker(); // an old position must not stay on the map
      this.setMode("off");
      this.showMessage(MSG_DENIED);
    } else if (this.mode === "waiting") {
      // No signal or a timeout: the watch keeps running and may still succeed.
      this.showMessage(MSG_NOT_FOUND);
    }
  };

  /** Called by Leaflet when a finger starts dragging the map. */
  private readonly onDragStart = (): void => {
    if (this.mode === "follow") this.setMode("shown");
  };

  /** Changes the mode, and shows it on the button for the styles, the tests, and screen readers. */
  private setMode(newMode: Mode): void {
    this.mode = newMode;
    this.button.dataset["mode"] = newMode;
    this.button.setAttribute("aria-pressed", String(newMode === "follow"));
  }

  /** Stops the location watch, if one is running. */
  private stopWatching(): void {
    if (this.watchId !== null) {
      this.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /** Takes the blue dot and its circle off the map, if they are there. */
  private removeMarker(): void {
    if (this.marker !== null) {
      this.marker.dot.remove();
      this.marker.circle.remove();
      this.marker = null;
    }
  }
}
