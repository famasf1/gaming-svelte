import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Profile', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/profile');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('profile page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/profile');

		await expect(page.locator('h1')).toContainText('Profile');
	});

	test.skip('shows user email', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/profile');

		await expect(page.locator('input[disabled]')).toBeVisible();
	});

	test.skip('has social links fields', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/profile');

		await expect(page.locator('text=Social Links')).toBeVisible();
		await expect(page.locator('text=YouTube')).toBeVisible();
		await expect(page.locator('text=Discord')).toBeVisible();
	});

	test.skip('has change password section', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/profile');

		await expect(page.locator('text=Change Password')).toBeVisible();
		await expect(page.locator('input[name="current_password"]')).toBeVisible();
		await expect(page.locator('input[name="new_password"]')).toBeVisible();
	});

	test('has logout button', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/profile');

		await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
	});
});
