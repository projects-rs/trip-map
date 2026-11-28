---
name: preparing-review-guide
description: How to build, keep up to date, and archive the review guide for a Trip Map pull request, as a local file that is never committed. Load as soon as a PR is pushed and opened, after every later push, and before the PR is merged.
---

# Preparing a review guide

Every pull request gets a **review guide** before review is requested (AGENTS.md, "Review"). It lets a reviewer, who may not know TypeScript or the browser well, review the change thoroughly: what to read, in which order, what each part does, and where to look hardest. The process and the list of past reviews are in `docs/reviews/README.md`; the explanations shared by all reviews are in `docs/reviews/background.md`.

## 1. Ask the reviewer first

Before writing, ask the reviewer (in the conversation, or in a PR comment):

- Which languages do you know well?
- Are TypeScript, the browser (events, the page, CSS), and Leaflet familiar?
- Is this your first review on this project?

From the answers, choose which sections of `background.md` to link at the top of the guide. Never repeat those basics inside the guide. If `background.md` lacks something this reviewer needs, add it there, not to the guide.

## 2. Where the guide lives

- **Name:** "Trip Map PR #<GitHub number> (plan PR <n>): review guide", for example "Trip Map PR #4 (plan PR 1): review guide". GitHub's number comes first, because it is the one people see and click; the plan's number (DESIGN.md section 13.3) follows in brackets.
- **A local file, never committed:** `review-guides/pr-<GitHub number>-review-guide.md` in the author's copy of the repository. The folder is in `.gitignore`, so the guide never reaches the repository: its line numbers and code maps go stale.
- **When:** build it as soon as the pull request is pushed and opened, and update it on every later push (section 4).
- **Tell the reviewer** right away that it exists, with its path, and that VS Code shows it with its drawings (`Ctrl+K` then `V`). Write the same path in the PR description under "Review guide".
- **An author working in the cloud,** whose files the reviewer cannot open, sends the file to the reviewer instead, and sends it again after each update.

## 3. What the guide contains

Use this order. Leave out a part marked "when" if it does not apply; keep every "always" part, even if short. Be concise: tables for anything with several attributes, drawings in a text format (Mermaid) for flows and state machines, short sentences.

| # | Part | Contents | |
| --- | --- | --- | --- |
| 1 | Header | PR number and link, plan step (DESIGN.md 13.3), design sections followed, size in lines of code, check status | Always |
| 2 | Summary | What the PR does and why, in 3 to 5 lines | Always |
| 3 | Background links | The `background.md` sections this reviewer asked for (step 1) | When any |
| 4 | Reading order | Every file, in an order where each builds on the ones before, grouped in levels (0: what runs first; 1: the app; 2: tests and tools; 3: project rules), with the attention each needs: review carefully, read quickly, glance, or skip, and why | Always |
| 5 | Code map | For each new or changed file: every name (constants, types, classes, functions, fields), its kind, what it does, and what it interacts with. For a changed file, only what changed | Always |
| 6 | Line by line | For the files marked "review carefully": a table of lines, code, and meaning, with the C, C++, or Python equivalent where it helps | Always, for those files |
| 7 | Behavior | State machines as a drawing, and a state × event table covering every cell | When the PR has a state machine or flow |
| 8 | Decisions | Each decision the PR makes, the alternatives considered, and why | When any |
| 9 | Rules check | The AGENTS.md rules the PR touches, and whether each is enforced by a check or only written | Always |
| 10 | Tests | What the tests cover, what they do not, and the link to the run and its screenshots | Always |
| 11 | Review questions | Where to look hardest: failure paths, event order, cleanup, security, privacy, performance | Always |
| 12 | Try it | Steps on the phone, or in Chrome's phone simulation with a fake GPS position | When the user sees a change |
| 13 | Open points | Decisions needed from the reviewer, as checkboxes | Always |

Every fact in the guide is checked against the PR's latest commit: line numbers, names, sizes, check results. Link code at that commit, not at the branch, so links stay correct.

## 4. Keep it in sync during review

- After every new commit: update the line numbers, tables, sizes, and check status it affects.
- When the reviewer asks a question in the conversation, answer it there, then add the answer to the guide, in the part it belongs to. If it explains a general concept, add it to `background.md` instead and link it.
- Tick open points as they are decided, with the decision and the date.

## 5. Before the merge: a short archive

The guide itself is not kept. Before the merge:

1. **Check the documents.** Every decision taken during review must already be in DESIGN.md, `docs/ARCHITECTURE.md`, or `background.md`, written by its own commit during the review (AGENTS.md: a pull request keeps the design in sync). If one is missing, add it now in a new commit. Nothing is copied from the guide into those documents.
2. **Open points** not settled become GitHub issues.
3. **Post a short archive comment** on the PR, headed "Review guide (archived at merge)", extracted from the guide: the summary, each decision with its reason, the questions and answers worth keeping, and the open points with links to their issues. At most about 60 lines: no code map, no line-by-line tables, no reading order.
4. **Add a line** for the PR to the list in `docs/reviews/README.md`.
5. **Delete the local guide file,** and tell the reviewer it is archived.
