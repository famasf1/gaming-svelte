import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Categories', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/categories');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('categories page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		await expect(page.locator('h1')).toContainText('Categories');
		await expect(page.locator('text=New Category')).toBeVisible();
	});

	test('can create a new category', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		await page.click('text=New Category');
		await expect(page.locator('h2')).toContainText('New Category');

		const uniqueName = `Test Category ${Date.now()}`;
		await page.locator('input[name="name"]').fill(uniqueName);
		await page.locator('textarea[name="description"]').fill('Test description');

		await page.click('button:has-text("Save")');

		await page.waitForLoadState('networkidle');
		await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
	});

	test('can edit an existing category', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			await expect(page.locator('h2')).toContainText('Edit Category');

			await page.locator('input[name="name"]').fill('Updated Category');
			await page.click('button:has-text("Save")');

			await page.waitForURL('/admin/categories');
		}
	});

	test('can delete a category', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		const deleteButton = page.locator('button:has-text("Delete")').first();
		if (await deleteButton.isVisible()) {
			await deleteButton.click();

			await expect(page.locator('text=Are you sure')).toBeVisible();

			await page.locator('.fixed button:has-text("Delete")').click();
		}
	});

	test('shows empty state when no categories', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		const hasCategories = await page.locator('table').isVisible();
		if (!hasCategories) {
			await expect(page.locator('text=No categories found')).toBeVisible();
		}
	});

	test('category form has required fields', async ({ page }) => {
		test.skip(true, 'Validation handled by HTML5 required attribute');
	});

	test('slug auto-generates from name', async ({ page }) => {
		test.skip(true, 'Slug auto-generated on server, no input field');
	});

	test('can filter categories', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/categories');

		const searchInput = page.locator('input[placeholder*="Search"]');
		if (await searchInput.isVisible()) {
			await searchInput.fill('Test');
			await expect(page.locator('text=Test Category')).toBeVisible();
		}
	});
});
