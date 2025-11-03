import { test, expect } from '@playwright/test';

test('T12 UI validation hints and ranges', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Property/i }).click().catch(() => {
    // fallback route
    return page.goto('/property-form');
  });

  await expect(page.getByText('Bedrooms (1-7)')).toBeVisible();
  await expect(page.getByText('Bathrooms (1-5)')).toBeVisible();
  await expect(page.getByText('Floor Area (sqm) (1-1000)')).toBeVisible();
  await expect(page.getByText('Location Index (0-10)')).toBeVisible();

  // set invalid values and expect toast errors on submit
  await page.getByLabel(/Bedrooms/).fill('0');
  await page.getByRole('button', { name: /Predict Price/i }).click();
  await expect(page.getByText(/Bedrooms must be between 1 and 7/i)).toBeVisible();

  await page.getByLabel(/Bedrooms/).fill('3');
  await page.getByLabel(/Bathrooms/).fill('0');
  await page.getByRole('button', { name: /Predict Price/i }).click();
  await expect(page.getByText(/Bathrooms must be between 1 and 5/i)).toBeVisible();

  await page.getByLabel(/Bathrooms/).fill('2');
  await page.getByLabel(/Floor Area/).fill('0');
  await page.getByRole('button', { name: /Predict Price/i }).click();
  await expect(page.getByText(/Floor area must be between 1 and 1000/i)).toBeVisible();

  await page.getByLabel(/Floor Area/).fill('120');
  await page.getByLabel(/Property Age/).fill('121');
  await page.getByRole('button', { name: /Predict Price/i }).click();
  await expect(page.getByText(/Property age must be between 0 and 120/i)).toBeVisible();

  await page.getByLabel(/Property Age/).fill('8');
  await page.getByLabel(/Location Index/).fill('11');
  await page.getByRole('button', { name: /Predict Price/i }).click();
  await expect(page.getByText(/Location index must be between 0 and 10/i)).toBeVisible();
});


