import { expect, test } from '@playwright/test';

test.describe('Admin Tags', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/tags');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('tags page renders correctly when authenticated', async ({ page }) => {
		await page.goto('/admin/login');
		await page.locator('input[type="email"]').fill('jambo5167@gmail.com');
		await page.locator('input[type="password"]').fill('Dad4aderr');
		await page.locator('button[type="submit"]').click();
		await page.waitForURL('/admin', { timeout: 60000 });

		await page.goto('/admin/tags');

		await expect(page.locator('h1')).toContainText('Tags');
	});
});
