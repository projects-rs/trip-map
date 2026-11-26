# Rules for AI coding tools

Trip Map is a phone-first web app. The design is in [docs/DESIGN.md](docs/DESIGN.md); how the code is organized is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). These rules apply to every AI tool that changes this repository.

## The owner decides

- The app owner reviews and merges every change. Never merge, publish, or change repository settings.
- The owner reads Python, C, and C++, not JavaScript. Write code that a reader of those languages can follow, and explain anything unusual in the pull request.
- Follow the design. If a change needs a decision the design does not make, ask; do not decide alone.

## Small pull requests

- One purpose per pull request, as split in the "Pull requests" column of DESIGN.md section 13.3.
- **At most 300 to 500 lines of code** in one pull request, not counting comments, blank lines, documents, and copied libraries in `vendor/`. Split anything bigger.
- Every pull request description says: what it does, which design sections it follows, how it was tested, and what the owner should try on the phone.

## How the code is written

- Plain JavaScript modules, HTML, and CSS. No framework and no build step: the files in the repository are the files the phone runs.
- Every code file starts with the license line (`SPDX-License-Identifier: MIT`) and a short comment saying what the file is for.
- `// @ts-check` at the top of every JavaScript file, and a JSDoc description on every function: what it does, what it receives, and what it returns (DESIGN.md section 13.6).
- Where code follows a rule from the design, the comment names the section, for example "DESIGN.md section 5.1".
- Choose the form of each new piece of code with these four questions, in order, and say which one applies in the pull request:
    1. A library or the browser requires a class (for example `L.Control.extend`, a Web Component)? → a class.
    2. Data that is saved, loaded, or shared (anything that goes into JSON: a trip, a site, a legend entry)? → a plain object with a JSDoc type, never a class.
    3. A calculation with no memory between calls (opening hours, distance, file checks)? → a plain function.
    4. An entity whose state evolves through its behavior (the location button, the legend panel, navigation)? → a class. Its state is in `#private` fields; methods called back by the browser or a library are arrow-function fields (`onTap = () => { … }`), so they always keep `this`.
  If another form seems clearer or safer, ask the owner first.
- Short functions with clear names. Comments explain why, not only what.
- Text from a trip, a user, or any other outside source is shown only as plain text (`textContent`), never as HTML (DESIGN.md section 14.3).
- Libraries are copied into `vendor/<name>-<version>/` unchanged from their official package, with their license, and listed in [NOTICES.md](NOTICES.md). Load the skill [`adding-libraries`](.claude/skills/adding-libraries/SKILL.md) before adding or updating one; `tools/check-vendor.js` fails any pull request whose copy differs from the official files.

## Tests

- Load the skill [`writing-tests`](.claude/skills/writing-tests/SKILL.md) before writing or changing any test.
- Tests never change or harm the app's code or any real data. They use fake data only (DESIGN.md section 13.4).
- Run `npm test` before opening a pull request. The same tests run on GitHub in a simulated Android phone and iPhone.

## Never

- Never put a password, key, or token in the repository.
- Never write to `trip-db` or any real trip from code or tests.
- Never load code from another website at run time.
