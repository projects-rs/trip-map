// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// The app's starting point: checks the page, creates the map, and connects
// the buttons. index.html loads the compiled js/main.js as a module, after Leaflet.

import { createMap } from "./map.ts";
import { MyLocation } from "./location.ts";

/** How long a message stays on the screen, in milliseconds. */
const MESSAGE_TIME_MS = 6000;

/** The timer that hides the current message; undefined when none is running. */
let messageTimer: number | undefined;

/**
 * Finds an element the app needs in index.html, and checks that it is the
 * right kind (a button, a paragraph...), or stops the start-up with a clear
 * error. Every element is found once, here at start-up, so a missing one fails
 * at once instead of later, in the middle of use (AGENTS.md).
 *
 * @param id  The element's id in index.html.
 * @param kind  The kind of element expected, for example HTMLButtonElement.
 * @returns  The element, already of that kind; never null.
 */
function requireElement<T extends HTMLElement>(id: string, kind: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof kind)) {
    throw new Error(`index.html has no ${kind.name} with id="${id}"`);
  }
  return element;
}

// Start-up, part 1: check every element the app needs, before anything else.
const messageBox = requireElement("message", HTMLParagraphElement);
const button = requireElement("my-location", HTMLButtonElement);

/**
 * Shows a short message above the buttons, and hides it after a few seconds.
 * The text is set as plain text, never as HTML (DESIGN.md section 14.3, threat 1).
 *
 * @param text  The message.
 */
function showMessage(text: string): void {
  messageBox.textContent = text;
  messageBox.hidden = false;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => { messageBox.hidden = true; }, MESSAGE_TIME_MS);
}

// Start-up, part 2: create the map and connect the button.
const map = createMap("map");
new MyLocation(map, button, showMessage);
