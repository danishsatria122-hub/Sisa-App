import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // testnya saling bergantung urutan data (seed), aman dijalankan serial
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'html',
  timeout: 30_000,

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Playwright bisa otomatis menyalakan frontend jika belum jalan.
  // Backend HARUS sudah jalan manual (npm run start:dev di folder backend)
  // beserta database yang sudah di-migrate & di-seed sebelum test ini dijalankan.
  webServer: {
    command: 'npm run dev --prefix ../frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
