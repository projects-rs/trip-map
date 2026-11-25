# Architecture

How the Trip Map app is built, and how its parts work together. What the app does, and why, is in [DESIGN.md](DESIGN.md). This description grows with each build step.

## Principles

- **No build step.** The files in the repository are exactly what GitHub Pages serves and the phone runs. There is nothing to compile.
- **Plain JavaScript modules.** Each file in `js/` is a module with a few exported functions, described in JSDoc and checked with `// @ts-check`.
- **Libraries are copied in**, under `vendor/<name>-<version>/`, never loaded from another website.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The only page. Loads Leaflet, the styles, and `js/main.js` |
| `css/app.css` | The app's styles |
| `js/main.js` | The starting point: creates the map and connects the buttons |
| `js/map.js` | `createMap()`: the full-screen map with OpenStreetMap's street map |
| `js/location.js` | `setUpMyLocation()`: the "My location" button and the blue dot (UI-08) |
| `vendor/leaflet-1.9.4/` | Leaflet, the map library ([NOTICES.md](../NOTICES.md)) |
| `icons/` | The icon set (DESIGN.md section 5.4) |
| `tests/` | Phone tests (DESIGN.md section 13.4), with `playwright.config.js` |
| `tools/check-tests.js` | Checks the tests themselves: description blocks and no real addresses |
| `.github/workflows/tests.yml` | Runs the checks and the tests on every pull request |

## How the parts connect

```text
index.html
  ├─ vendor/leaflet-1.9.4/leaflet.js   defines the global L
  └─ js/main.js
       ├─ js/map.js        createMap("map")  → the Leaflet map
       └─ js/location.js   setUpMyLocation(map, button, showMessage)
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

Dragging the map with a finger turns `follow` back into `shown`. If location is refused, a message explains how to allow it, and the mode returns to `off`.
