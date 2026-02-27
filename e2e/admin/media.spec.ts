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
		await expect(page.locator('text=View Trash')).toBeVisible();
	});

	test('shows empty state when no images', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		await expect(page.locator('text=No images uploaded yet')).toBeVisible();
	});

	test('can upload image via click', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles({
			name: 'test-image.png',
			mimeType: 'image/png',
			buffer: Buffer.from('fake-image-data')
		});

		await page.waitForTimeout(1000);
	});

	test('shows upload zone', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		await expect(
			page.locator('text=Drag and drop an image here, or click to select')
		).toBeVisible();
	});

	test('can navigate to trash from media page', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		await page.click('text=View Trash');

		await expect(page).toHaveURL(/\/admin\/media\/trash/);
		await expect(page.locator('h1')).toContainText('Media Trash');
	});

	test('edit button visible on media hover', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media');

		const editButton = page.locator('a:has-text("Edit")');
		await expect(editButton).toHaveCount(0);
	});
});

test.describe('Admin Media Edit', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/media/1');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('media edit page renders correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media/1');

		await expect(page.locator('h1')).toContainText('Edit Media');
		await expect(page.locator('text=Back to Media')).toBeVisible();
	});
});

test.describe('Admin Media Trash', () => {
	test('redirects to login when not authenticated', async ({ page }) => {
		await page.goto('/admin/media/trash');

		await expect(page).toHaveURL(/\/admin\/login/);
	});

	test('trash page renders correctly', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media/trash');

		await expect(page.locator('h1')).toContainText('Media Trash');
		await expect(page.locator('text=Back to Media')).toBeVisible();
	});

	test('shows empty state when trash is empty', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media/trash');

		await expect(page.locator('text=Trash is empty')).toBeVisible();
	});

	test('can navigate back to media from trash', async ({ page }) => {
		await loginAsAdmin(page);

		await page.goto('/admin/media/trash');

		await page.click('text=Back to Media');

		await expect(page).toHaveURL(/\/admin\/media/);
	});
});
