import { expect, test } from '@playwright/test';

test.describe('Frontend Article View', () => {
	test('shows 404 for non-existent article', async ({ page }) => {
		await page.goto('/articles/non-existent-article-slug');

		await expect(page.locator('text=Article not found')).toBeVisible();
	});

	test('article page renders when article exists', async ({ page }) => {
		await page.goto('/');

		const articleLink = page.locator('a[href^="/articles/"]').first();
		if (await articleLink.isVisible()) {
			await articleLink.click();
			await expect(page.locator('article')).toBeVisible();
		}
	});
});
