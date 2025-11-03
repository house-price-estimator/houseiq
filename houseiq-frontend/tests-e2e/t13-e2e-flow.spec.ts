import { test, expect } from '@playwright/test';

const backend = process.env.BACKEND_URL || 'http://localhost:8080';

async function registerAndLogin(email: string, password: string, name: string) {
  const reg = await fetch(`${backend}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  const regJson = await reg.json();
  return regJson.token as string;
}

test('T13 UI E2E: login -> form -> submit -> result -> history -> delete', async ({ page }) => {
  const email = `ui${Date.now()}@example.com`;
  const token = await registerAndLogin(email, 'Secret1!', 'UI');

  // Open app and navigate to form
  await page.goto('/');
  await page.getByRole('link', { name: /Property/i }).click().catch(() => page.goto('/property-form'));

  // Fill fields
  await page.getByLabel(/Bedrooms/).fill('3');
  await page.getByLabel(/Bathrooms/).fill('2');
  await page.getByLabel(/Floor Area/).fill('120.5');
  await page.getByLabel(/Property Age/).fill('8');
  await page.getByLabel(/Location Index/).fill('4');

  // Inject token into localStorage if app uses it; else backend is authenticated by JWT header in API client
  await page.evaluate((t) => localStorage.setItem('authToken', t), token);

  // Submit
  await page.getByRole('button', { name: /Predict Price/i }).click();

  // Result screen check
  await expect(page).toHaveURL(/prediction-result/);
  await expect(page.getByText(/Predicted Price/i)).toBeVisible();

  // Go to history
  await page.goto('/history').catch(() => page.getByRole('link', { name: /History/i }).click());
  await expect(page.getByText(/Prediction History/i)).toBeVisible();

  // Expect at least one item, then delete top item
  const cards = page.locator('text=Delete Prediction');
  await expect(cards.first()).toBeVisible();
  const countBefore = await cards.count();
  await cards.first().click();
  // Confirm dialog may appear
  page.on('dialog', d => d.accept());

  // Wait and validate removal
  await expect(page.locator('text=Delete Prediction')).toHaveCount(countBefore - 1);
});


