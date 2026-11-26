// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The app's starting point: creates the map and connects the buttons.
// index.html loads this file as a module, after Leaflet.
// @ts-check

import { createMap } from "./map.js";
import { MyLocation } from "./location.js";

/** How long a message stays on the screen, in milliseconds. */
const MESSAGE_TIME_MS = 6000;

/** @type {number | undefined} The timer that hides the current message. */
let messageTimer;

/**
 * Shows a short message above the buttons, and hides it after a few seconds.
 * The text is set as plain text, never as HTML (DESIGN.md section 14.3, threat 1).
 *
 * @param {string} text  The message.
 */
function showMessage(text) {
  const box = /** @type {HTMLElement} */ (document.getElementById("message"));
  box.textContent = text;
  box.hidden = false;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => { box.hidden = true; }, MESSAGE_TIME_MS);
}

const map = createMap("map");
const button = /** @type {HTMLButtonElement} */ (document.getElementById("my-location"));
new MyLocation(map, button, showMessage);
