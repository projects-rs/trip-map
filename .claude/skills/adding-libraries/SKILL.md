---
name: adding-libraries
description: How to add or update a third-party library that the Trip Map app loads. Load before adding, updating, or removing any library.
---

# Adding or updating a library

A library the app loads runs with the same power as the app's own code, so it must be **exactly** the official release. Trip Map never stores libraries in the repository and never loads them from another website while running. The build copies each one, unchanged, from its official npm package at an exact version into `site/vendor/<package>/` (DESIGN.md section 13.7). A version is written in one place only: `package.json`.

## Before adding one

- Ask the owner first. A new library is a design decision: say what it is for, its size, its license, and why the app's own code or the browser cannot do the job.
- Only libraries with a license that allows this use (MIT, BSD, Apache-2.0, ISC). Never GPL code in the app.

## Steps

1. **Pick the exact version**: the latest stable release, at least two weeks old, of the library's official npm package. Never a range (`^1.9`), never "latest", never a beta.
2. **Add it to `package.json`** under `devDependencies`, with that exact version: the one place the version is written. If it has type descriptions (`@types/<package>`), add those too, at the same major.minor version.
3. **List the files the app needs** in `LIBRARIES` in `tools/build-site.ts`: the package and each file's path in it (for example `dist/leaflet.js`). The build checks that npm installed exactly the version in `package.json` and copies the files unchanged into `site/vendor/<package>/`.
4. **Load it in `index.html`** from `vendor/<package>/…`, a relative path, with no version in it.
5. **Add a row to `NOTICES.md`**: name, use, license, and the credit the license asks for.
6. **Add it to the Dependabot group** in `.github/dependabot.yml` if it has a type package, so both update together.
7. **Run `npm install` and `npm test`.**

Never edit, rebuild, or bundle a library's files, and never take them from anywhere but the official npm package. If the package cannot be installed, stop and tell the owner; do not build your own copy.

## Updating a library

Updates normally arrive as Dependabot pull requests, which change `package.json` only. If the build then names another place that must agree (for Leaflet: `LEAFLET_VERSION` in `src/leaflet.ts`), update it in the same pull request. The pull request says what changed in the library (its changelog). Moving to a new major version (Leaflet 2.0) is a planned change, not a routine update.
