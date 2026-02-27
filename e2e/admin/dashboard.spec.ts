import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Dashboard', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('dashboard renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		await expect(page.locator('h1')).toContainText('Dashboard');
	});

	test('shows recent articles', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		const recentArticles = page.locator('text=Recent Articles');
		if (await recentArticles.isVisible()) {
			await expect(recentArticles).toBeVisible();
		}
	});

	test('shows statistics cards', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		await expect(page.locator('text=Total Articles')).toBeVisible();
		await expect(page.locator('text=Published')).toBeVisible();
		await expect(page.locator('main').getByText('Categories')).toBeVisible();
		await expect(page.locator('main').getByText('Tags')).toBeVisible();
		await expect(page.locator('main').getByText('Pages')).toBeVisible();
		await expect(page.locator('text=Pending Comments')).toBeVisible();
	});

	test('shows quick action buttons', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		await expect(page.locator('a:has-text("New Article")')).toBeVisible();
		await expect(page.locator('a:has-text("New Page")')).toBeVisible();
		await expect(page.locator('a:has-text("New Category")')).toBeVisible();
		await expect(page.locator('a:has-text("New Tag")')).toBeVisible();
	});

	test('quick action buttons navigate correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		await page.locator('a:has-text("New Article")').click();
		await expect(page).toHaveURL(/\/admin\/articles\/new/);

		await page.goto('/admin');
		await page.locator('a:has-text("New Page")').click();
		await expect(page).toHaveURL(/\/admin\/pages\/new/);

		await page.goto('/admin');
		await page.locator('a:has-text("New Category")').click();
		await expect(page).toHaveURL(/\/admin\/categories/);

		await page.goto('/admin');
		await page.locator('a:has-text("New Tag")').click();
		await expect(page).toHaveURL(/\/admin\/tags/);
	});

	test('shows view all links', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		const viewAllLinks = page.locator('a:has-text("View All")');
		await expect(viewAllLinks).toHaveCount(4);
	});

	test('view all links navigate correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		const viewAllLinks = page.locator('main a:has-text("View All")');
		await expect(viewAllLinks).toHaveCount(4);

		await viewAllLinks.nth(0).click();
		await expect(page).toHaveURL(/\/admin\/articles/);

		await page.goto('/admin');
		await viewAllLinks.nth(1).click();
		await expect(page).toHaveURL(/\/admin\/categories/);

		await page.goto('/admin');
		await viewAllLinks.nth(2).click();
		await expect(page).toHaveURL(/\/admin\/tags/);

		await page.goto('/admin');
		await viewAllLinks.nth(3).click();
		await expect(page).toHaveURL(/\/admin\/pages/);
	});

	test('pending comments card links to filtered comments', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		const pendingComments = page.locator('a:has-text("Pending Comments")');
		await expect(pendingComments).toBeVisible();
		await pendingComments.click();
		await expect(page).toHaveURL(/\/admin\/comments\?filter=pending/);
	});

	test('sidebar navigation is accessible', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin');

		await expect(page.locator('a:has-text("Dashboard")')).toBeVisible();
		await expect(page.locator('a:has-text("Articles")')).toBeVisible();
		await expect(page.locator('a:has-text("Categories")')).toBeVisible();
	});
});
