// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Checks the test files themselves (DESIGN.md section 13.4), on every pull request:
//   1. Every test starts with a description block holding What, How, and
//      Interface (section 13.4.1), so none slips in without one.
//   2. No test file contains a real address: the published app, the trip
//      database, or GitHub's address for changing them. Tests use fake data only.
// Run with: node tools/check-tests.ts   (exits with 1 if a check fails)

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const TEST_DIR = "tests";

/** Addresses a test must never contain (section 13.4, "How the rule is enforced"). */
const FORBIDDEN = [
  "projects-rs.github.io",          // the published app and trip-db
  "github.com/projects-rs",         // the repositories themselves
  "api.github.com",                 // GitHub's address for changing them
  "firebaseio.com",                 // a real Firebase database
  "firebasedatabase.app",
];

/** Fields every description block must hold (section 13.4.1). */
const REQUIRED_FIELDS = ["What:", "How:", "Interface:"];

/**
 * Finds the problems in one test file.
 * @param path  The file's path.
 * @returns  One line per problem; empty when the file is fine.
 */
function problemsIn(path: string): string[] {
  const text = readFileSync(path, "utf8");
  const problems: string[] = [];

  for (const address of FORBIDDEN) {
    if (text.includes(address)) problems.push(`${path}: contains the real address "${address}"`);
  }

  // Each test(...) call, and the text just before it back to the previous test.
  const testCall = /^test(?:\.\w+)?\(\s*"([^"]+)"/gm;
  let previousEnd = 0;
  for (const match of text.matchAll(testCall)) {
    const before = text.slice(previousEnd, match.index);
    const block = before.lastIndexOf("/**") >= 0 ? before.slice(before.lastIndexOf("/**")) : "";
    const missing = REQUIRED_FIELDS.filter((field) => !block.includes(field));
    if (!block.trimEnd().endsWith("*/") || missing.length > 0) {
      problems.push(`${path}: test "${match[1]}" needs a description block with ${REQUIRED_FIELDS.join(", ")}`);
    }
    previousEnd = (match.index ?? 0) + match[0].length;
  }
  return problems;
}

const files = readdirSync(TEST_DIR).filter((name) => name.endsWith(".ts")).map((name) => join(TEST_DIR, name));
const problems = files.flatMap(problemsIn);
for (const line of problems) console.error(line);
console.log(`Checked ${files.length} test file(s): ${problems.length} problem(s).`);
process.exit(problems.length > 0 ? 1 : 0);
