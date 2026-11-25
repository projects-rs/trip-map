// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Phone tests of the main screen: the map and "My location"
// (DESIGN.md section 4, control UI-08; build step 1).
// Fake data only: a fake GPS position and blank map images (DESIGN.md section 13.4).
// @ts-check

import { test, expect } from "playwright/test";

/** A fake position in Haifa, near the test trip's hotel (step 0b). */
const HAIFA = { latitude: 32.8156, longitude: 34.9892, accuracy: 20 };
/** A second fake position, about 300 m north-east of the first. */
const HAIFA_LATER = { latitude: 32.8180, longitude: 34.9915, accuracy: 20 };

/** A 1×1 grey PNG image, sent instead of every real map image. */
const BLANK_TILE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGO4BwAA3gDdx9CV6QAAAABJRU5ErkJggg==",
  "base64",
);

/**
 * Answers every request for a map image with BLANK_TILE, so the tests never
 * load OpenStreetMap's server, and records the addresses asked for.
 * @param {import("playwright/test").Page} page
 * @returns {Promise<string[]>} The list the tile addresses are added to.
 */
async function fakeTiles(page) {
  /** @type {string[]} */
  const asked = [];
  await page.route("https://tile.openstreetmap.org/**", (route) => {
    asked.push(route.request().url());
    return route.fulfill({ contentType: "image/png", body: BLANK_TILE });
  });
  return asked;
}

/**
 * How far, in screen pixels, the blue dot is from the center of the map.
 * @param {import("playwright/test").Page} page
 * @returns {Promise<number>}
 */
async function dotDistanceFromCenter(page) {
  const dot = await page.locator(".blue-dot").boundingBox();
  const map = await page.locator("#map").boundingBox();
  if (!dot || !map) throw new Error("the blue dot or the map is not on the screen");
  const dx = dot.x + dot.width / 2 - (map.x + map.width / 2);
  const dy = dot.y + dot.height / 2 - (map.y + map.height / 2);
  return Math.hypot(dx, dy);
}

/**
 * What: The map fills the whole screen, shows OpenStreetMap's street map, and
 *       shows the OpenStreetMap credit its license requires.
 * How: Open the app with blank map images. Expect the map to be as large as the
 *      screen, map images to be asked from tile.openstreetmap.org, and the
 *      credit "OpenStreetMap contributors" to be visible.
 * Interface: index.html → map.createMap() → Leaflet tile layer (module: map)
 * Specifics: Map images are replaced by a blank image; no real server is used.
 */
test("the map fills the screen and credits OpenStreetMap", async ({ page }) => {
  const asked = await fakeTiles(page);
  await page.goto("index.html");

  const map = await page.locator("#map").boundingBox();
  const screen = page.viewportSize();
  expect(map?.width).toBe(screen?.width);
  expect(map?.height).toBe(screen?.height);

  await expect.poll(() => asked.length).toBeGreaterThan(0);
  expect(asked[0]).toMatch(/^https:\/\/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/);
  await expect(page.locator(".leaflet-control-attribution")).toContainText("OpenStreetMap contributors");
});

/**
 * What: The first tap on "My location" shows the blue dot at the phone's
 *       position and centers the map on it; nothing is asked before the tap.
 * How: Allow location, set a fake position in Haifa, and open the app. Expect no
 *      blue dot. Tap the button. Expect the dot at the center of the map, and the
 *      button in mode "shown".
 * Interface: UI-08 button → location.setUpMyLocation() → navigator.geolocation (module: location)
 * Specifics: Fake GPS position.
 */
test("first tap on My location shows the blue dot in the center", async ({ page, context }) => {
  await fakeTiles(page);
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation(HAIFA);
  await page.goto("index.html");

  await expect(page.locator(".blue-dot")).toHaveCount(0);
  await page.locator("#my-location").tap();

  await expect(page.locator(".blue-dot")).toBeVisible();
  await expect(page.locator("#my-location")).toHaveAttribute("data-mode", "shown");
  await expect.poll(() => dotDistanceFromCenter(page)).toBeLessThan(3);
});

/**
 * What: A second tap makes the map follow the user while walking, and dragging
 *       the map stops following.
 * How: Tap twice, then move the fake position: expect the dot to stay centered.
 *      Drag the map, then move the position back: expect the map to stay where
 *      the user dragged it, and the button to be back in mode "shown".
 * Interface: UI-08 button and map drag → location.setUpMyLocation() → Leaflet map (module: location)
 * Specifics: Fake GPS position that moves; a mouse drag stands in for a finger.
 */
test("second tap follows the user, and dragging stops it", async ({ page, context }) => {
  await fakeTiles(page);
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation(HAIFA);
  await page.goto("index.html");
  const button = page.locator("#my-location");

  await button.tap();
  await expect(button).toHaveAttribute("data-mode", "shown");
  await button.tap();
  await expect(button).toHaveAttribute("data-mode", "follow");
  await expect(button).toHaveAttribute("aria-pressed", "true");

  await context.setGeolocation(HAIFA_LATER);
  await expect.poll(() => dotDistanceFromCenter(page)).toBeLessThan(3);

  // Drag the map 120 px to the left: the user wants to look around.
  const map = await page.locator("#map").boundingBox();
  if (!map) throw new Error("the map is not on the screen");
  const y = map.y + map.height / 3;
  await page.mouse.move(map.x + 200, y);
  await page.mouse.down();
  await page.mouse.move(map.x + 140, y, { steps: 5 });
  await page.mouse.move(map.x + 80, y, { steps: 5 });
  await page.mouse.up();
  await expect(button).toHaveAttribute("data-mode", "shown");

  await context.setGeolocation(HAIFA);
  await expect.poll(() => dotDistanceFromCenter(page)).toBeGreaterThan(50);
});

/**
 * What: When location is refused, the app says so in plain words and the
 *       button goes back to "off".
 * How: Open the app without allowing location and tap the button. Expect the
 *      message about turning location on, and mode "off".
 * Interface: UI-08 button → location.setUpMyLocation() → navigator.geolocation error (module: location)
 * Specifics: Location permission not granted, so the browser refuses it.
 */
test("refused location shows a clear message", async ({ page }) => {
  await fakeTiles(page);
  await page.goto("index.html");
  await page.locator("#my-location").tap();

  await expect(page.locator("#message")).toContainText("Location is off for Trip Map");
  await expect(page.locator("#my-location")).toHaveAttribute("data-mode", "off");
  await expect(page.locator(".blue-dot")).toHaveCount(0);
});
