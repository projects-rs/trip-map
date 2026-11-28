// SPDX-License-Identifier: MIT
// Copyright (c) 2026 The Trip Map authors
//
// Settings for the phone tests (DESIGN.md sections 13.2 and 13.4): every test
// runs twice, in a simulated Android phone (Chrome's engine) and a simulated
// iPhone (Safari's engine), against the built site/ folder served on this
// machine (npm run build first; npm test does both), never against the real app's address.
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
  // Serves the built site/ folder, exactly as GitHub Pages will, with the
  // project's own Node server (tools/serve-site.ts), so the tests run on
  // Windows, Mac and Linux alike. "localhost" counts as a secure address,
  // so the browser allows location there.
  webServer: {
    command: `node tools/serve-site.ts ${PORT}`,
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",          // a server error shows in the test output
  },
});
