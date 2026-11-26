---
name: adding-libraries
description: How to add or update a third-party library in the Trip Map repository (the vendor/ folder). Load before copying, updating, or removing any library.
---

# Adding or updating a library

Trip Map copies each library into `vendor/` instead of loading it from another website, so the app works offline and runs only code that was reviewed. A copied library runs with the same power as the app's own code, so it must be **exactly** the official release. `tools/check-vendor.js` enforces this on every pull request.

## Before adding one

- Ask the owner first. A new library is a design decision: say what it is for, its size, its license, and why the app's own code or the browser cannot do the job.
- Only libraries with a license that allows this use (MIT, BSD, Apache-2.0, ISC). Never GPL code in the app.

## Steps

1. **Pick the exact version**, at least two weeks old, from the library's official npm package. Never a range (`^1.9`), never "latest".
2. **Add it to `package.json`** under `devDependencies`, with that exact version.
3. **Copy the files the app needs, unchanged**, from `node_modules/<package>/` into `vendor/<package>-<version>/`: the browser file (for example `dist/leaflet.js`), its CSS and images if any, and its `LICENSE`. Never edit, minify again, rebuild, or bundle a copied file. If the official file is not reachable, stop and tell the owner; do not build your own.
4. **List every copied file** in `LIBRARIES` in `tools/check-vendor.js`: where it is copied to, and where it comes from in the package.
5. **Add a row to `NOTICES.md`**: name, use, version, license, and the credit the license asks for.
6. **Run `npm install` and `npm run check-vendor`.** Every file must say `same`.

## Updating a library

Use a new folder for the new version (`vendor/leaflet-1.9.5/`), update the paths in `index.html`, `LIBRARIES`, and `NOTICES.md`, and delete the old folder in the same pull request. The pull request says what changed in the library (its changelog) and why the update is needed.

## Never

- Never load a library from a CDN or any other website at run time.
- Never change a file in `vendor/`, even to fix a bug: report the bug, or ask the owner.
