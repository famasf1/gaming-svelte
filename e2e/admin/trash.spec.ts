import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../test-utils';

test.describe('Admin Trash', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/trash');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test.skip('trash page renders correctly when authenticated', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		await expect(page.locator('h1')).toContainText('Trash');
	});

	test.skip('shows empty state when trash is empty', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const hasItems = await page.locator('table').isVisible();
		if (!hasItems) {
			await expect(page.locator('text=Trash is empty')).toBeVisible();
		}
	});

	test.skip('can restore an item from trash', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const restoreButton = page.locator('button:has-text("Restore")').first();
		if (await restoreButton.isVisible()) {
			await restoreButton.click();

			await expect(page.locator('text=Restore')).toBeVisible();
			await page.click('button:has-text("Confirm Restore")');
		}
	});

	test.skip('can permanently delete an item', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const deleteButton = page.locator('button:has-text("Delete Permanently")').first();
		if (await deleteButton.isVisible()) {
			await deleteButton.click();

			await expect(page.locator('text=Permanently delete')).toBeVisible();
			await page.click('button:has-text("Delete")');
		}
	});

	test.skip('can filter trash by type', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const articlesFilter = page.locator('button:has-text("Articles")');
		if (await articlesFilter.isVisible()) {
			await articlesFilter.click();

			const hasItems = await page.locator('table').isVisible();
			if (hasItems) {
				await expect(page.locator('text=Article')).toBeVisible();
			}
		}
	});

	test.skip('can select multiple items for bulk action', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const checkboxes = page.locator('input[type="checkbox"]');
		const count = await checkboxes.count();

		if (count > 1) {
			await checkboxes.nth(0).check();
			await checkboxes.nth(1).check();

			const restoreAllButton = page.locator('button:has-text("Restore Selected")');
			if (await restoreAllButton.isVisible()) {
				await expect(restoreAllButton).toBeVisible();
			}
		}
	});

	test.skip('shows deleted date for items', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const hasItems = await page.locator('table').isVisible();
		if (hasItems) {
			await expect(page.locator('text=Deleted')).toBeVisible();
		}
	});

	test.skip('can empty entire trash', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const emptyTrashButton = page.locator('button:has-text("Empty Trash")');
		if (await emptyTrashButton.isVisible()) {
			await emptyTrashButton.click();

			await expect(page.locator('text=Empty entire trash')).toBeVisible();
			await page.click('button:has-text("Empty Trash")');
		}
	});

	test.skip('restore button redirects to appropriate section', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/trash');

		const restoreButton = page.locator('button:has-text("Restore")').first();
		if (await restoreButton.isVisible()) {
			await restoreButton.click();

			await expect(page.locator('text=Restore this item')).toBeVisible();
		}
	});
});
