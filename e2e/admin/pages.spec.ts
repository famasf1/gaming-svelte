import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Pages', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/pages');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('pages page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages');

		await expect(page.locator('h1')).toContainText('Pages');
		await expect(page.locator('text=New Page')).toBeVisible();
	});

	test('can create a new page', async ({ page }) => {
		page.on('console', (msg) => console.log(`Console: ${msg.text()}`));
		page.on('pageerror', (err) => console.log(`Error: ${err}`));

		await loginAsAdmin(page);

		await page.goto('/admin/pages/new');

		await expect(page.locator('h1')).toContainText('New Page');

		const uniqueName = `Test Page ${Date.now()}`;
		await page.locator('input[name="title"]').fill(uniqueName);
		await page.locator('input[name="slug"]').fill(uniqueName.toLowerCase().replace(/\s+/g, '-'));
		await page.locator('textarea[name="content"]').fill('Test content for the page');

		await page.locator('button:has-text("Save")').click();

		await page.waitForURL('/admin/pages', { timeout: 15000 });
		await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
	});

	test('can edit an existing page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			await expect(page.locator('h1')).toContainText('Edit Page');

			await page.locator('input[name="title"]').fill('Updated Page');
			await page.click('button:has-text("Save")');

			await page.waitForLoadState('networkidle');
		}
	});

	test('can delete a page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages');

		const deleteButton = page.locator('button:has-text("Delete")').first();
		if (await deleteButton.isVisible()) {
			await deleteButton.click();

			await expect(page.locator('text=Are you sure')).toBeVisible();

			await page.locator('.fixed button:has-text("Delete")').click();
		}
	});

	test('shows empty state when no pages', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages');

		const hasPages = await page.locator('table').isVisible();
		if (!hasPages) {
			await expect(page.locator('text=No pages found')).toBeVisible();
		}
	});

	test.skip('page form has required fields', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages/new');

		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('input[name="slug"]')).toBeVisible();
		await expect(page.locator('textarea[name="content"]')).toBeVisible();
	});

	test.skip('slug auto-generates from title', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages/new');

		const titleInput = page.locator('input[name="title"]');
		const slugInput = page.locator('input[name="slug"]');

		await titleInput.fill('My Test Page');
		await expect(slugInput).toHaveValue('my-test-page', { timeout: 5000 });
	});

	test.skip('can publish/unpublish a page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/pages');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			const publishSwitch = page.locator('input[name="is_published"]');
			await publishSwitch.click();

			await page.click('button:has-text("Save")');

			await page.waitForLoadState('networkidle');
		}
	});
});
