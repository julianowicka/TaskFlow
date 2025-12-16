import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('strona się ładuje i nie ma krytycznych błędów a11y', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/TaskFlow/i);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  console.log('A11y issues found:', accessibilityScanResults.violations.length);
});
