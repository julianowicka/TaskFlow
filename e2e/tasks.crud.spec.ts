import { test, expect } from '@playwright/test';

test('Tasks CRUD (local-first)', async ({ page }) => {
  await page.goto('/');

  // utwórz
  await page.getByTestId('task-title-input').fill('Nowe zadanie');
  await page.getByRole('button', { name: /dodaj/i }).click();
  await expect(page.getByTestId('task-item-Nowe zadanie')).toBeVisible();

  // edytuj
  await page
    .getByTestId('task-item-Nowe zadanie')
    .getByRole('button', { name: /edytuj/i })
    .click();
  await page.getByTestId('task-edit-input').fill('Zmienione');
  await page.getByRole('button', { name: /zapisz/i }).click();
  await expect(page.getByTestId('task-item-Zmienione')).toBeVisible();

  // usuń
  await page.getByTestId('task-item-Zmienione').getByRole('button', { name: /usuń/i }).click();
  await expect(page.getByTestId('task-item-Zmienione')).toHaveCount(0);
});
