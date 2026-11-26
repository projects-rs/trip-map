---
name: adding-libraries
description: How to add or update a third-party library that the Trip Map app loads. Load before adding, updating, or removing any library.
---

# Adding or updating a library

A library the app loads runs with the same power as the app's own code, so it must be **exactly** the official release. Trip Map never stores libraries in the repository and never loads them from another website while running. The build copies each one, unchanged, from its official npm package at an exact version into `site/vendor/<package>-<version>/` (DESIGN.md section 13.7).

## Before adding one

- Ask the owner first. A new library is a design decision: say what it is for, its size, its license, and why the app's own code or the browser cannot do the job.
- Only libraries with a license that allows this use (MIT, BSD, Apache-2.0, ISC). Never GPL code in the app.

## Steps

1. **Pick the exact version**, at least two weeks old, of the library's official npm package. Never a range (`^1.9`), never "latest".
2. **Add it to `package.json`** under `devDependencies`, with that exact version. If it has type descriptions (`@types/<package>`), add those too, at a version matching the library's.
3. **List the files the app needs** in `LIBRARIES` in `tools/build-site.ts`: the package, the exact version, and each file's path in the package (for example `dist/leaflet.js`). The build checks the installed version and copies the files unchanged.
4. **Load it in `index.html`** from `vendor/<package>-<version>/…`, a relative path.
5. **Add a row to `NOTICES.md`**: name, use, version, license, and the credit the license asks for.
6. **Run `npm install` and `npm test`.**

Never edit, rebuild, or bundle a library's files, and never take them from anywhere but the official npm package. If the package cannot be installed, stop and tell the owner; do not build your own copy.

## Updating a library

Change the version in `package.json`, `LIBRARIES`, `index.html`, and `NOTICES.md` in the same pull request. The pull request says what changed in the library (its changelog) and why the update is needed.
