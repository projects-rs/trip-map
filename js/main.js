// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The app's starting point: checks the page, creates the map, and connects
// the buttons. index.html loads this file as a module, after Leaflet.
// @ts-check

import { createMap } from "./map.js";
import { MyLocation } from "./location.js";

/** How long a message stays on the screen, in milliseconds. */
const MESSAGE_TIME_MS = 6000;

/** @type {number | undefined} The timer that hides the current message. */
let messageTimer;

/**
 * Finds an element the app needs in index.html, or stops the start-up with a
 * clear error. Every element is found once, here at start-up, so a missing one
 * fails at once instead of later, in the middle of use (AGENTS.md).
 *
 * @param {string} id  The element's id in index.html.
 * @returns {HTMLElement}  The element; never null.
 */
function requireElement(id) {
  const element = document.getElementById(id);
  if (element === null) throw new Error(`index.html has no element with id="${id}"`);
  return element;
}

// Start-up, part 1: check every element the app needs, before anything else.
const messageBox = requireElement("message");
const button = /** @type {HTMLButtonElement} */ (requireElement("my-location"));

/**
 * Shows a short message above the buttons, and hides it after a few seconds.
 * The text is set as plain text, never as HTML (DESIGN.md section 14.3, threat 1).
 *
 * @param {string} text  The message.
 */
function showMessage(text) {
  messageBox.textContent = text;
  messageBox.hidden = false;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => { messageBox.hidden = true; }, MESSAGE_TIME_MS);
}

// Start-up, part 2: create the map and connect the button.
const map = createMap("map");
new MyLocation(map, button, showMessage);
