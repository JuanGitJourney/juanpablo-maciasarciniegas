import dotenv from 'dotenv';
dotenv.config();

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: process.env.CI === 'true' || process.env.DOCKER === 'true',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
