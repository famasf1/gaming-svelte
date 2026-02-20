import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
	test('admin login link is accessible', async ({ page }) => {
		await page.goto('/admin/login');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('admin routes redirect to login when not authenticated', async ({ page }) => {
		const adminRoutes = [
			'/admin',
			'/admin/articles',
			'/admin/categories',
			'/admin/tags',
			'/admin/pages'
		];

		for (const route of adminRoutes) {
			await page.goto(route);
			await expect(page).toHaveURL(/\/admin\/login/);
		}
	});

	test('can navigate from homepage to article', async ({ page }) => {
		await page.goto('/');

		const articleLink = page.locator('a[href^="/articles/"]').first();
		if (await articleLink.isVisible()) {
			const href = await articleLink.getAttribute('href');
			await articleLink.click();
			await expect(page).toHaveURL(new RegExp(href ?? '/articles/'));
		}
	});
});
