---
name: writing-tests
description: Rules for writing or changing any test in the Trip Map repository. Load before creating, editing, or reviewing a test file.
---

# Writing tests for Trip Map

These rules come from DESIGN.md section 13.4. Follow all of them.

## 1. Tests never change or harm the app or real data

- Use fake data only: test trips, fake GPS positions, planted values, blank map images.
- Never use a real address: not the published app (`projects-rs.github.io`), not `trip-db`, not GitHub's API, not a real Firebase project. `tools/check-tests.ts` fails the pull request if a test file contains one.
- Never write to the repository, merge, or publish. The test workflow has read-only permission and no keys.
- Firebase tests (from release C) run only against the Firebase emulator, and fail at once if they are not connected to it.
- Answer outside requests inside the test (for example with `page.route`), so a test never depends on a real server.

## 2. Test interfaces, not the obvious

- Test what a module offers to others and the calls between modules, for example "UI-08 button → location module → the browser's location".
- Do not write tests that repeat what the code plainly does ("setting a field sets the field").
- A small internal function gets its own test only when it is easy to get subtly wrong: opening hours, pie-chart segments, icon set versions, locking group data.

## 3. Every test starts with a description block

`tools/check-tests.ts` fails the pull request if a test has no block with **What**, **How**, and **Interface**. Add the other fields when they apply:

| Field | When | What it says |
| --- | --- | --- |
| What | Always | What it checks, in one or two sentences |
| How | Always | The input, the action, and the expected result |
| Interface | Always | The module and API tested, or the cross-module call ("A → B") |
| Specifics | When needed | Fake time, fake GPS, a sample file, iPhone-only behavior |
| Flow | Connectivity and Firebase tests | The steps in order, who does what, when the connection is cut |
| Usability | Firebase tests | What the user would notice if this broke |
| Threat | Security tests | The attack or gap checked, and its known kind |
| Hazard | Security tests | What could happen if the protection is bypassed |

Example:

```ts
/**
 * What: The first tap on "My location" shows the blue dot at the phone's
 *       position and centers the map on it.
 * How: Allow location, set a fake position, open the app, tap the button.
 *      Expect the dot at the center of the map.
 * Interface: UI-08 button → location.MyLocation → navigator.geolocation (module: location)
 * Specifics: Fake GPS position.
 */
test("first tap on My location shows the blue dot in the center", async ({ page, context }) => {
  // ...
});
```

## 4. Phone tests

- Tests run in both projects of `playwright.config.ts`: "Android phone" (Chrome's engine) and "iPhone" (Safari's engine). Do not limit a test to one without a comment saying why.
- Use the user's gestures (`tap`, drag) and read what the user sees (visible text, `data-mode`, `aria-pressed`), not the code's inner variables.
- Tests run on the built site (`npm test` builds first), exactly what GitHub publishes.
- A screenshot of every test is kept automatically for the review.
- No retries: a flaky test is a bug to fix.
- Every test also fails if the page throws an error during it (the `pageerror` check at the top of each test file, DESIGN.md section 13.4). Keep that check in every new test file.
