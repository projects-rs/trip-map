# Notices: what the app relies on

Everything the app uses that it did not write itself, with its license and the credit it requires (DESIGN.md sections 13.6 and 14.1). The same list is shown in the app under Settings → About, once Settings exists (build step 7).

| What | Used for | Version | License | Credit and notes |
| --- | --- | --- | --- | --- |
| [Leaflet](https://leafletjs.com) | Showing the map | 1.9.4 | BSD-2-Clause, in [vendor/leaflet-1.9.4/LICENSE](vendor/leaflet-1.9.4/LICENSE) | © 2010–2023 Volodymyr Agafonkin, © 2010–2011 CloudMade. Credited on the map. |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) data | The street map | — | Open Database License (ODbL) | "© OpenStreetMap contributors", shown on the map with a link |
| OpenStreetMap tile server | Map images while online | — | [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/) | Light use only; no bulk or offline downloading |

## How the Leaflet file was made

`vendor/leaflet-1.9.4/leaflet.js` was built from Leaflet's source at its release tag `v1.9.4` (commit `d15112c`), with esbuild 0.28 (`--bundle --format=iife --global-name=L --minify`). `leaflet.css`, `images/`, and `LICENSE` are copied unchanged from the same tag. SHA-256 of `leaflet.js`: `011a38df42514fffaaa4fc8b468f4a652d8fd3122d407d0e7e183fb603f78241`.
