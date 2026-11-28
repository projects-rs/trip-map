// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Checks, on every pull request, the code rules the compiler cannot enforce
// by itself (AGENTS.md, "How the code is written"): no type casts (`x as T`,
// `<T>x`) and no `any`. It reads every TypeScript file as a tree with the
// TypeScript compiler the project already uses, so words like "as" in a
// comment, a string, or `import * as` are never mistaken for a cast.
//
// Run with: node tools/check-code.ts   (exits with 1 if it finds any)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

/** The project's own TypeScript: the app, the tools, the tests, and the test settings. */
const ROOTS = ["src", "tools", "tests", "playwright.config.ts"];

/**
 * Lists every TypeScript file under a folder, or the file itself.
 * Receives a folder or file path. Returns the .ts file paths found.
 */
function tsFiles(path: string): string[] {
  if (!statSync(path).isDirectory()) return path.endsWith(".ts") ? [path] : [];
  return readdirSync(path).flatMap((name) => tsFiles(join(path, name)));
}

/**
 * Says whether a node breaks a rule, and which.
 * Receives one node of the code's tree. Returns the problem, or null.
 */
function problemWith(node: ts.Node): string | null {
  // `x as const` only fixes a literal's exact value; it cannot lie about a type.
  if (ts.isAsExpression(node) && !(ts.isTypeReferenceNode(node.type) && node.type.typeName.getText() === "const")) {
    return `a type cast "as ${node.type.getText()}": check the type in code instead (instanceof, typeof, === null)`;
  }
  if (ts.isTypeAssertionExpression(node)) {
    return `a type cast "<${node.type.getText()}>": check the type in code instead (instanceof, typeof, === null)`;
  }
  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return `the type "any", which turns type checking off: use the real type, or "unknown" and a check`;
  }
  return null;
}

/**
 * Finds every rule broken in one file.
 * Receives the file's path. Returns one line per problem: file, line, column, and what to do.
 */
function problemsIn(path: string): string[] {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
  const problems: string[] = [];
  const visit = (node: ts.Node): void => {
    const problem = problemWith(node);
    if (problem !== null) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart());
      problems.push(`${path}:${line + 1}:${character + 1}: ${problem}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return problems;
}

const files = ROOTS.flatMap(tsFiles);
const problems = files.flatMap(problemsIn);
for (const line of problems) console.error(line);
console.log(`Checked ${files.length} TypeScript file(s) for casts and "any": ${problems.length} problem(s).`);
process.exit(problems.length > 0 ? 1 : 0);
