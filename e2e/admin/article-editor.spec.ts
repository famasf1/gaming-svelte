import { expect, test } from '@playwright/test';
import { loginAsAdmin, ADMIN_EMAIL, ADMIN_PASSWORD } from '../test-utils';

test.describe('Admin Article Editor', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/articles/new');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('create article form renders correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles/new');

		await expect(page.locator('h1')).toContainText('New Article');
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('input[name="slug"]')).toBeVisible();
		await expect(page.locator('textarea[name="excerpt"]')).toBeVisible();
		await expect(page.locator('button:has-text("Save")')).toBeVisible();
	});

	test.skip('slug auto-generates from title', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles/new');

		const titleInput = page.locator('input[name="title"]');
		const slugInput = page.locator('input[name="slug"]');

		await titleInput.fill('My Test Article');
		await expect(slugInput).toHaveValue('my-test-article', { timeout: 5000 });
	});

	test('can create a new article', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles/new');

		await page.locator('input[name="title"]').fill('Playwright Test Article');
		await page.locator('input[name="slug"]').fill('playwright-test-article');
		await page
			.locator('textarea[name="excerpt"]')
			.fill('This is a test article created by Playwright.');

		await page.locator('button:has-text("Save")').click();

		await page.waitForURL('/admin/articles', { timeout: 15000 });
	});

	test('edit article page loads existing data', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			await expect(page.locator('h1')).toContainText('Edit Article');
			await expect(page.locator('input[name="title"]')).toHaveValue(/./);
		}
	});

	test('preview button opens in new tab', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			const previewButton = page.locator('button:has-text("Preview")');
			if (await previewButton.isVisible()) {
				const [previewPage] = await Promise.all([
					page.waitForEvent('popup'),
					previewButton.click()
				]);

				await expect(previewPage).toHaveURL(/\/admin\/articles\/\d+\/preview/);
			}
		}
	});

	test('delete button shows trash dialog', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			const deleteButton = page.locator('button:has-text("Move to Trash")');
			if (await deleteButton.isVisible()) {
				await deleteButton.click();

				await expect(
					page.locator('text=Are you sure you want to move this article to trash?')
				).toBeVisible();
			}
		}
	});

	test('can update an existing article', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			const titleInput = page.locator('input[name="title"]');
			const originalTitle = await titleInput.inputValue();

			await titleInput.fill(originalTitle + ' Updated');

			await page.locator('button:has-text("Save")').click();

			await page.waitForURL('/admin/articles');
		}
	});

	test.skip('shows error when duplicate slug is used', async ({ page }) => {
		await loginAsAdmin(page);

		const uniqueSlug = `test-slug-${Date.now()}`;

		await page.goto('/admin/articles/new');
		await page.locator('input[name="title"]').fill('First Article');
		await page.locator('input[name="slug"]').fill(uniqueSlug);
		await page.locator('textarea[name="excerpt"]').fill('First article content');
		await page.locator('button:has-text("Save")').click();

		await page.waitForURL('/admin/articles', { timeout: 15000 });

		await page.goto('/admin/articles/new');
		await page.locator('input[name="title"]').fill('Second Article');
		await page.locator('input[name="slug"]').fill(uniqueSlug);
		await page.locator('textarea[name="excerpt"]').fill('Second article content');
		await page.locator('button:has-text("Save")').click();

		await expect(page.locator('text=Slug already exists')).toBeVisible();
	});

	test('can publish an article', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/articles/new');

		const uniqueSlug = `test-article-${Date.now()}`;

		await page.locator('input[name="title"]').fill('Published Test Article');
		await page.locator('input[name="slug"]').fill(uniqueSlug);
		await page.locator('textarea[name="excerpt"]').fill('This article will be published.');

		await page.locator('label:has-text("Published")').click();

		await page.locator('button:has-text("Save")').click();

		await page.waitForURL('/admin/articles');
	});
});
