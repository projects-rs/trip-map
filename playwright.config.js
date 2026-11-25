// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Settings for the phone tests (DESIGN.md sections 13.2 and 13.4): every test
// runs twice, in a simulated Android phone (Chrome's engine) and a simulated
// iPhone (Safari's engine), against a copy of the app served on this machine,
// never against the real app's address.
// @ts-check

import { defineConfig, devices } from "playwright/test";

const PORT = 8123;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,     // a test left as "only" fails on GitHub
  retries: 0,                        // a flaky test is a bug to fix, not to retry
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}/`,
    screenshot: "on",                // a screenshot of every test, for the review
    trace: "retain-on-failure",
  },
  projects: [
    { name: "Android phone", use: { ...devices["Pixel 7"] } },
    { name: "iPhone", use: { ...devices["iPhone 15"] } },
  ],
  // Serves the repository's files, as GitHub Pages would. "localhost" counts as
  // a secure address, so the browser allows location there.
  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "ignore",        // the server lists every file it sends; not needed
  },
});
