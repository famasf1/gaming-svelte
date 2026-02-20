import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Media', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/media');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('media page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		await expect(page.locator('h1')).toContainText('Media');
	});

	test('shows empty state when no images', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		await expect(page.locator('text=No images uploaded yet')).toBeVisible();
	});

	test('image grid displays when images exist', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		const imageGrid = page.locator('.grid');
		if (await imageGrid.isVisible()) {
			await expect(page.locator('img')).toBeVisible();
		}
	});

	test('copy URL button is visible on hover', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		const imageContainer = page.locator('.group').first();
		if (await imageContainer.isVisible()) {
			await imageContainer.hover();
			await expect(page.locator('button:has-text("Copy URL")')).toBeVisible();
		}
	});
});
