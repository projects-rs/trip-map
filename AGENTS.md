# Rules for AI coding tools

Trip Map is a phone-first web app. The design is in [docs/DESIGN.md](docs/DESIGN.md); how the code is organized is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). These rules apply to every AI tool that changes this repository.

## The owner decides

- A pull request can be approved and merged by the project owner or by a member listed in `.github/CODEOWNERS`.
- Only the project owner can change the organization, project, or repository settings.
- Follow the design. If a change needs a decision the design does not make, ask; do not decide alone.

## Design documents

- The design document (`docs/DESIGN.md`) may be split into several documents as the project grows; each is linked from the design's table of contents.
- Every drawing, flow chart, or diagram is written in a text format, such as Mermaid or SVG, so it can be reviewed and changed like code. Use a drawing when it makes a complex flow or design simpler to understand than words.

## Pull requests and commits

- **One feature or theme per pull request,** defined in advance and meeting a concrete need of the app, as split in the "Pull requests" column of DESIGN.md section 13.3.
- **Every pull request is described in a design document, and stays in sync with it.** If the code changes something the design describes, the same pull request updates the design.
- **At most 300 to 500 lines of code** in one pull request, not counting comments, blank lines, and documents. If that is not possible, the pull request is broken into commits as below.
- **A larger pull request is broken into commits,** each holding one concrete piece: one idea, one class, or one module, with its own working code flow. Whoever merges decides whether to squash them into one.
- **Every pull request and commit has a message that states its content clearly:** a first line of at most 72 characters saying what changed, then, after a blank line, why.
- **Every pull request has a full description:**
    - the main changes;
    - each touched file, and why it was needed;
    - the design sections that drive the change, with links;
    - how it was tested, and what the owner should try on the phone;
    - anything it leaves open: unfinished parts, questions, or settings only the owner can change.

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
- Use Leaflet only through `src/leaflet.ts` (`import { L, type Leaflet } from "./leaflet.ts"`), never the global `L`; the compiler enforces it (DESIGN.md section 13.7).
- Libraries come only from their official npm packages, at exact versions in `package.json`, which is the one place a version is written; the build copies them unchanged into `site/vendor/<package>/` and stops if anything disagrees with `package.json`. Updates arrive as Dependabot pull requests, reviewed like any other. They are listed in [NOTICES.md](NOTICES.md). Load the skill [`adding-libraries`](.claude/skills/adding-libraries/SKILL.md) before adding or updating one.

## Tests

- Load the skill [`writing-tests`](.claude/skills/writing-tests/SKILL.md) before writing or changing any test.
- Tests never change or harm the app's code or any real data. They use fake data only (DESIGN.md section 13.4).
- Run `npm test` (it builds, then tests) before opening a pull request. The same type check, build, and tests run on GitHub in a simulated Android phone and iPhone.

## Never

- Never put a password, key, or token in the repository.
- Never write to `trip-db` or any real trip from code or tests.
- Never load code from another website at run time.
- Never change any organization, project, or repository setting: only the project owner can.
- Never give a workflow permission to publish or write, except the publish job in `.github/workflows/publish.yml`, which runs only after the owner approves it.
