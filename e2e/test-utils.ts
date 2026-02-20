import type { Page } from '@playwright/test';

export const ADMIN_EMAIL = 'jambo5167@gmail.com';
export const ADMIN_PASSWORD = 'Dad4aderr';

export async function loginAsAdmin(page: Page) {
	await page.goto('/admin/login');
	await page.waitForLoadState('networkidle');

	await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
	await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
	await page.locator('button[type="submit"]').click();

	await page.waitForURL('/admin', { timeout: 60000 });
}

export async function logout(page: Page) {
	await page.goto('/admin/login');
}
