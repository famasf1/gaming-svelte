import { expect, test } from '@playwright/test';

test.describe('Admin Login', () => {
	test('login page renders correctly', async ({ page }) => {
		await page.goto('/admin/login');

		await expect(page.locator('h1')).toContainText('Admin Login');
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('input[type="password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test('shows error with invalid credentials', async ({ page }) => {
		await page.goto('/admin/login');

		await page.locator('input[type="email"]').fill('invalid@example.com');
		await page.locator('input[type="password"]').fill('wrongpassword');
		await page.locator('button[type="submit"]').click();

		await expect(page.locator('.bg-destructive\\/10')).toBeVisible();
	});

	test('login form has required fields', async ({ page }) => {
		await page.goto('/admin/login');

		const emailInput = page.locator('input[type="email"]');
		const passwordInput = page.locator('input[type="password"]');

		await expect(emailInput).toHaveAttribute('required', '');
		await expect(passwordInput).toHaveAttribute('required', '');
	});
});
