// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Checks two rules of AGENTS.md ("Code style") that ESLint does not cover, as
// part of `npm run build`: every code file starts with the license line, and
// every function, method, and handler has a /** ... */ description just above
// it. It reads each file as a tree with the TypeScript compiler, so a comment
// elsewhere in the file never counts as a function's description.
//
// Run with: node tools/check-headers.ts   (exits with 1 if a rule is broken)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

/** The project's own code: the app, the tools, the tests, and the settings files written as code. */
const ROOTS = ["src", "tools", "tests", "playwright.config.ts", "eslint.config.js"];

/** The first line every code file must start with (AGENTS.md). */
const LICENSE_LINE = "// SPDX-License-Identifier: MIT";

/**
 * Lists every code file under a folder, or the file itself.
 * Receives a folder or file path. Returns the .ts and .js file paths found.
 */
function codeFiles(path: string): string[] {
  if (!statSync(path).isDirectory()) return /\.(ts|js)$/.test(path) ? [path] : [];
  return readdirSync(path).flatMap((name) => codeFiles(join(path, name)));
}

/**
 * Names the kind of a node that must carry a description, or returns null.
 * Receives one node of the code's tree. Returns "function", "method", or null.
 */
function needsDescription(node: ts.Node): string | null {
  if (ts.isFunctionDeclaration(node)) return "function";
  if (ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node)) return "method";
  // A handler written as an arrow-function field: onTap = (): void => { ... }
  if (ts.isPropertyDeclaration(node) && node.initializer !== undefined && ts.isArrowFunction(node.initializer)) {
    return "method";
  }
  return null;
}

/**
 * Finds every rule broken in one file.
 * Receives the file's path. Returns one line per problem: file, line, and what is missing.
 */
function problemsIn(path: string): string[] {
  const text = readFileSync(path, "utf8");
  const problems: string[] = [];
  if (!text.startsWith(LICENSE_LINE)) problems.push(`${path}:1: the first line must be "${LICENSE_LINE}"`);

  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const visit = (node: ts.Node): void => {
    const kind = needsDescription(node);
    if (kind !== null && ts.getJSDocCommentsAndTags(node).length === 0) {
      const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      problems.push(`${path}:${line}: this ${kind} needs a /** ... */ description just above it`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return problems;
}

const files = ROOTS.flatMap(codeFiles);
const problems = files.flatMap(problemsIn);
for (const line of problems) console.error(line);
console.log(
  `Checked ${files.length} code file(s) for the license line and descriptions: ${problems.length} problem(s).`,
);
process.exit(problems.length > 0 ? 1 : 0);
