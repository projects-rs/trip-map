# Rules for AI coding tools

Trip Map is a phone-first web app. The design is in [docs/DESIGN.md](docs/DESIGN.md); how the code is organized is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). These rules apply to every AI tool that changes this repository.

## The owner decides

- The app owner reviews and merges every change. Never merge, publish, or change repository settings.
- The owner reads Python, C, and C++, not JavaScript. Write code that a reader of those languages can follow, and explain anything unusual in the pull request.
- Follow the design. If a change needs a decision the design does not make, ask; do not decide alone.

## Small pull requests

- One purpose per pull request, as split in the "Pull requests" column of DESIGN.md section 13.3.
- **At most 300 to 500 lines of code** in one pull request, not counting comments, blank lines, and documents. Split anything bigger.
- Every pull request description says: what it does, which design sections it follows, how it was tested, and what the owner should try on the phone.

## How the code is written

- TypeScript in `src/`, plus HTML and CSS, with no framework (DESIGN.md section 13.7). `npm run build` compiles it with strict settings into `site/`, which is what GitHub publishes. Never commit `site/`.
- Every code file starts with the license line (`SPDX-License-Identifier: MIT`) and a short comment saying what the file is for.
- Types are written in the code (`function f(id: string): HTMLElement`), never in comments. A `/** … */` description on every function: what it does, what it receives, and what it returns (DESIGN.md section 13.6).
- No type casts (`as …`) and no `any`. Check in code instead (`instanceof`, `=== null`), so the compiler learns the type from the check. If a cast seems unavoidable, ask the owner first.
- Where code follows a rule from the design, the comment names the section, for example "DESIGN.md section 5.1".
- Choose the form of each new piece of code with these four questions, in order, and say which one applies in the pull request:
    1. A library or the browser requires a class (for example `L.Control.extend`, a Web Component)? → a class.
    2. Data that is saved, loaded, or shared (anything that goes into JSON: a trip, a site, a legend entry)? → a plain object described by a TypeScript `type`, never a class.
    3. A calculation with no memory between calls (opening hours, distance, file checks)? → a plain function.
    4. An entity whose state evolves through its behavior (the location button, the legend panel, navigation)? → a class. Its state is in `private` fields; methods called back by the browser or a library are arrow-function fields (`onTap = (): void => { … }`), so they always keep `this`.
  If another form seems clearer or safer, ask the owner first.
- Every element of the page the app needs is found once, at start-up in `src/main.ts`, with `requireElement(id, kind)`, which checks that it exists and is the right kind (`HTMLButtonElement`, …), so a missing or wrong element stops the start-up with a clear error instead of failing later in use.
- Short functions with clear names. Comments explain why, not only what.
- Text from a trip, a user, or any other outside source is shown only as plain text (`textContent`), never as HTML (DESIGN.md section 14.3).
- Libraries come only from their official npm packages, at exact versions in `package.json`; the build copies them unchanged into `site/vendor/`. They are listed in [NOTICES.md](NOTICES.md). Load the skill [`adding-libraries`](.claude/skills/adding-libraries/SKILL.md) before adding or updating one.

## Tests

- Load the skill [`writing-tests`](.claude/skills/writing-tests/SKILL.md) before writing or changing any test.
- Tests never change or harm the app's code or any real data. They use fake data only (DESIGN.md section 13.4).
- Run `npm test` (it builds, then tests) before opening a pull request. The same type check, build, and tests run on GitHub in a simulated Android phone and iPhone.

## Never

- Never put a password, key, or token in the repository.
- Never write to `trip-db` or any real trip from code or tests.
- Never load code from another website at run time.
- Never give a workflow permission to publish or write, except the publish job in `.github/workflows/publish.yml`, which runs only after the owner approves it.
