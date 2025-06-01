import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: process.env.CI === 'true' || process.env.DOCKER === 'true',
  },
});
