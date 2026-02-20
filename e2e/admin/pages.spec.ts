import { expect, test } from '@playwright/test';

test.describe('Admin Pages', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/pages');

		await expect(page).toHaveURL(/\/admin\/login/);
	});
});
