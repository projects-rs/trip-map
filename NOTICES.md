# Notices: what the app relies on

Everything the app uses that it did not write itself, with its license and the credit it requires (DESIGN.md sections 13.6 and 14.1). The same list is shown in the app under Settings → About, once Settings exists (build step 7).

| What | Used for | Version | License | Credit and notes |
| --- | --- | --- | --- | --- |
| [Leaflet](https://leafletjs.com) | Showing the map | 1.9.4 | BSD-2-Clause, published with the app in `vendor/leaflet-1.9.4/LICENSE` | © 2010–2023 Volodymyr Agafonkin, © 2010–2011 CloudMade. Credited on the map. |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) data | The street map | — | Open Database License (ODbL) | "© OpenStreetMap contributors", shown on the map with a link |
| OpenStreetMap tile server | Map images while online | — | [Tile usage policy](https://operations.osmfoundation.org/policies/tiles/) | Light use only; no bulk or offline downloading |

## How libraries reach the app

Libraries are not stored in this repository. The build (`npm run build`) copies each one, unchanged, from its official npm package at the exact version in `package.json` into the published site (DESIGN.md section 13.7). Build tools that are not published with the app (the TypeScript compiler, Leaflet's type descriptions, Playwright) are listed in `package.json` only.
