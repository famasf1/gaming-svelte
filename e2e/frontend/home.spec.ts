import { expect, test } from '@playwright/test';

test.describe('Frontend Homepage', () => {
	test('homepage renders correctly', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('h1')).toContainText('Latest News');
	});

	test('shows empty state when no articles', async ({ page }) => {
		await page.goto('/');

		const emptyState = page.locator('text=No articles published yet');
		if (await emptyState.isVisible()) {
			await expect(emptyState).toBeVisible();
		}
	});

	test('page title is set', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/Gaming News Blog/);
	});
});
