---
name: preparing-review-guide
description: How to prepare, keep up to date, and archive the review guide for a Trip Map pull request. Load before asking for a review, after every new commit on a PR under review, and before the PR is merged.
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

- **During review:** an editable document (a Claude doc when the reviewer works with Claude, otherwise a Markdown comment on the PR), linked from the PR description under "Review guide".
- **After merge:** archived as a comment on the PR (step 5). Guides are never stored in the repository: their line numbers and code maps go stale.

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

## 5. Before the merge: harvest, then archive

The guide is temporary; what lasts moves to permanent documents before the PR is merged:

1. **Decisions** go into DESIGN.md (with a version-history row), if not already there.
2. **How the code is organized** goes into `docs/ARCHITECTURE.md`.
3. **General explanations** given during review go into `docs/reviews/background.md`.
4. **Open points not settled** become GitHub issues, or items in the next PR's plan.
5. **Post the final guide** as a comment on the PR, headed "Review guide (archived at merge)".
6. **Add a line** for the PR to the list in `docs/reviews/README.md`.
