import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  globalSetup: "./playwright.global-setup.js",
  globalTeardown: "./playwright.global-teardown.js",
  testDir: "./tests",
  timeout: 30 * 1000,
  fullyParallel: false,
  workers: 1,

  reporter: [["html", { open: "on-failure" }], ["list"]],

  // WebServer Configuration
  webServer: {
    command: "npx cross-env NODE_ENV=test node backend/server.js",
    port: 5000,
    reuseExistingServer: false, // Ensure playwright starts a fresh server in test mode
    timeout: 120 * 1000, // Gives backend server up to 2 mins to start & connect to MongoDB Test
  },

  use: {
    baseURL: "http://localhost:5000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "API Automation",
      testDir: "./tests/api",
    },
    {
      name: "UI Automation",
      testDir: "./tests/ui",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
      },
    },
  ],
});
