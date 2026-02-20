import { expect, test } from '@playwright/test';
import { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from '../test-utils';

test.describe('Admin Articles', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/articles');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('articles list renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		await expect(page.locator('h1')).toContainText('Articles');
		await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
		await expect(page.locator('table')).toBeVisible();
	});

	test('filter buttons work correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		await expect(page.getByRole('link', { name: 'All' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Published' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Drafts' })).toBeVisible();

		await page.getByRole('link', { name: 'Published' }).click();
		await expect(page).toHaveURL(/filter=published/);

		await page.getByRole('link', { name: 'Drafts' }).click();
		await expect(page).toHaveURL(/filter=draft/);

		await page.getByRole('link', { name: 'All' }).click();
		await expect(page).toHaveURL(/filter=all/);
	});

	test('new article button navigates to create page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		await page.getByRole('link', { name: 'New Article' }).click();

		await expect(page.locator('h1')).toContainText('New Article', { timeout: 15000 });
	});

	test('edit link navigates to edit page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();
			await expect(page).toHaveURL(/\/admin\/articles\/\d+/);
		}
	});

	test('shows empty state when no articles', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const tableBody = page.locator('tbody');
		const rows = await tableBody.locator('tr').count();
		if (rows === 0) {
			await expect(page.locator('text=No articles found')).toBeVisible();
		}
	});
});
