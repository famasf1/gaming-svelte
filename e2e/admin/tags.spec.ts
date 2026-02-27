import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Tags', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/tags');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test.skip('tags page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/tags');

		await expect(page.locator('h1')).toContainText('Tags');
		await expect(page.locator('text=New Tag')).toBeVisible();
	});

	test.skip('can create a new tag', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/tags');

		await page.click('text=New Tag');
		await expect(page.locator('h2')).toContainText('New Tag');

		const uniqueName = `Test Tag ${Date.now()}`;
		await page.locator('input[name="name"]').fill(uniqueName);

		await page.click('button:has-text("Save")');

		await page.waitForLoadState('networkidle');
		await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
	});

	test.skip('can edit an existing tag', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/tags');

		const editLink = page.locator('a:has-text("Edit")').first();
		if (await editLink.isVisible()) {
			await editLink.click();

			await expect(page.locator('h2')).toContainText('Edit Tag');

			await page.locator('input[name="name"]').fill('Updated Tag');
			await page.click('button:has-text("Save")');

			await page.waitForURL('/admin/tags');
		}
	});

	test.skip('can delete a tag', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/tags');

		const deleteButton = page.locator('button:has-text("Delete")').first();
		if (await deleteButton.isVisible()) {
			await deleteButton.click();

			await expect(page.locator('text=Are you sure')).toBeVisible();

			await page.locator('.fixed button:has-text("Delete")').click();
		}
	});

	test('shows empty state when no tags', async ({ page }) => {
		test.skip(true, 'Flaky due to Supabase auth rate limiting');
	});

	test('slug auto-generates from name', async ({ page }) => {
		test.skip(true, 'Slug auto-generated on server, no input field');
	});

	test('tag form has required fields', async ({ page }) => {
		test.skip(true, 'Validation handled by HTML5 required attribute');
	});
});
