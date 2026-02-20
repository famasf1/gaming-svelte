import { expect, test } from '@playwright/test';

test.describe('Admin Trash', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/trash');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('trash page renders correctly when authenticated', async ({ page }) => {
		await page.goto('/admin/login');
		await page.waitForLoadState('networkidle');
		await page.locator('input[type="email"]').fill('jambo5167@gmail.com');
		await page.locator('input[type="password"]').fill('Dad4aderr');
		await page.locator('button[type="submit"]').click();
		await page.waitForURL('/admin', { timeout: 90000 });

		await page.goto('/admin/trash');

		await expect(page.locator('h1')).toContainText('Trash');
	});
});
