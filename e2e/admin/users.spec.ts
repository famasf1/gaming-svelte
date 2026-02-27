import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Users', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/users');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('users page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/users');

		await expect(page.locator('h1')).toContainText('Users');
	});

	test('shows list of users', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/users');

		await expect(page.locator('table')).toBeVisible();
	});
});
