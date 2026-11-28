// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// ESLint's settings: the code rules the compiler allows but AGENTS.md
// forbids, checked by `npm run build` right after the compiler. A plain .js
// file, because ESLint reads its settings before any TypeScript is compiled.
import tseslint from "typescript-eslint";

export default [
  // Generated and downloaded files are not ours to check.
  { ignores: ["site/**", "playwright-report/**", "test-results/**"] },
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tseslint.parser },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      // No `any`: it turns type checking off (AGENTS.md).
      "@typescript-eslint/no-explicit-any": "error",
      // No type casts (`x as T`, `<T>x`): check the type in code instead (AGENTS.md).
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
    },
  },
];
