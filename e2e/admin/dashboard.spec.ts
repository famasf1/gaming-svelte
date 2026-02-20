import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('dashboard renders correctly when authenticated', async ({ page }) => {
		await page.goto('/admin/login');
		await page.waitForLoadState('networkidle');
		await page.locator('input[type="email"]').fill('jambo5167@gmail.com');
		await page.locator('input[type="password"]').fill('Dad4aderr');
		await page.locator('button[type="submit"]').click();
		await page.waitForURL('/admin', { timeout: 90000 });

		await expect(page.locator('h1')).toContainText('Dashboard');
	});
});
