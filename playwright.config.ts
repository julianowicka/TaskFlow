import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Budujemy produkcyjnie i serwujemy statycznie (stabilniejsze E2E)
    command:
      'sh -c "npm run build -- --configuration=production && npx http-server dist/taskflow/browser -p 4200 --silent"',
    port: 4200,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
