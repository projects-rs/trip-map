# Architecture

How the Trip Map app is built, and how its parts work together. What the app does, and why, is in [DESIGN.md](DESIGN.md). This description grows with each build step.

## Principles

- **TypeScript, compiled before publishing** (DESIGN.md section 13.7). The code in `src/` has its types in the code itself, checked by the compiler with strict settings. `npm run build` compiles it to plain JavaScript and assembles `site/`, the exact folder the phone downloads.
- **Classes for entities with state and behavior; plain objects for data; plain functions for calculations** (AGENTS.md).
- **Libraries come from their official npm packages** at exact versions, copied unchanged by the build into `site/vendor/`; never loaded from another website while the app runs.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The only page. Loads Leaflet, the styles, and the compiled `js/main.js` |
| `css/app.css` | The app's styles |
| `src/main.ts` | The starting point: checks that every element the app needs is on the page (`requireElement`), creates the map, and connects the buttons |
| `src/leaflet.ts` | The one gateway to Leaflet: checks at start-up that Leaflet 1.9.4 is loaded, and exports `L` and its types. No other file touches the global `L` |
| `src/map.ts` | `createMap()`: the full-screen map with OpenStreetMap's street map |
| `src/location.ts` | class `MyLocation`: the "My location" button and the blue dot (UI-08) |
| `tsconfig.json` | The compiler's settings: strict, every warning an error |
| `tools/build-site.ts` | Assembles `site/` after the compiler: the page, styles, and libraries |
| `icons/` | The icon set (DESIGN.md section 5.4) |
| `tests/` | Phone tests (DESIGN.md section 13.4), with `playwright.config.ts` |
| `tools/check-tests.ts` | Checks the tests themselves: description blocks and no real addresses |
| `.github/workflows/tests.yml` | On every pull request: the test check, the type check and build, and the phone tests. Read-only |
| `.github/workflows/publish.yml` | After each merge: build, test that exact build, then publish to GitHub Pages once the owner approves |

## From source to phone

```text
src/*.ts ──tsc (strict)──> site/js/*.js ─┐
index.html, css/ ──copied──────────────> site/ ──publish (owner approves)──> GitHub Pages ──> the phone
leaflet (npm, exact version) ──copied──> site/vendor/leaflet-1.9.4/ ─┘
```

## How the parts connect

```text
index.html
  ├─ vendor/leaflet-1.9.4/leaflet.js   defines the global L
  └─ js/main.js   (compiled from src/main.ts)
       ├─ js/map.js        createMap("map")  → the Leaflet map
       ├─ js/location.js   new MyLocation(map, button, showMessage)
       └─ (both import) js/leaflet.js  checks the global L once and exports it
                             → navigator.geolocation (the phone's location)
```

## "My location" (UI-08)

The button moves through four modes, kept in its `data-mode` attribute:

| Mode | Meaning | A tap |
| --- | --- | --- |
| `off` | Location not used | Asks the phone for location (the first time, the phone asks the user) → `waiting` |
| `waiting` | Waiting for the first position | Nothing |
| `shown` | The blue dot is on the map | Centers the map on the dot → `follow` |
| `follow` | The map keeps the dot in its center | Centers again |

Dragging the map with a finger turns `follow` back into `shown`. If location is refused, the dot is removed, a message explains how to allow it, and the mode returns to `off`.
