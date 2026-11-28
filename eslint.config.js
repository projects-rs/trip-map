// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// ESLint's settings: the code style rules of AGENTS.md ("Code style") that the
// compiler does not check, run by `npm run build` right after the compiler.
// A plain .js file, because ESLint reads its settings before any TypeScript
// is compiled.
import tseslint from "typescript-eslint";

/** Page properties that insert text as HTML; outside text must go through textContent (DESIGN.md 14.3). */
const HTML_SINKS = ["innerHTML", "outerHTML", "insertAdjacentHTML"].map((property) => ({
  property,
  message: "Show text with textContent, never as HTML (DESIGN.md section 14.3).",
}));

export default [
  // Generated and downloaded files are not ours to check.
  { ignores: ["site/**", "playwright-report/**", "test-results/**"] },

  // typescript-eslint's standard checks: unused variables, unsafe patterns, and more.
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    rules: {
      // Types and correctness
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      eqeqeq: "error",
      "prefer-const": "error",
      "no-var": "error",

      // Names: camelCase, PascalCase for types and classes, UPPER_CASE for fixed constants
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["camelCase"] },
        { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },
        { selector: "import", format: ["camelCase", "PascalCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: ["objectLiteralProperty", "typeProperty"], format: null },
      ],

      // Size and shape
      "max-lines-per-function": ["error", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 4],
      "max-depth": ["error", 3],
      complexity: ["error", 10],

      // Safety
      "no-restricted-properties": [
        "error",
        ...HTML_SINKS,
        { object: "document", property: "write", message: "Never write HTML into the page." },
        { object: "document", property: "writeln", message: "Never write HTML into the page." },
      ],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-throw-literal": "error",
      "no-empty": "error",
    },
  },

  // The app itself: no console.log left behind (errors and warnings are allowed).
  { files: ["src/**/*.ts"], rules: { "no-console": ["error", { allow: ["warn", "error"] }] } },
];
