import type { Page } from '@playwright/test';

export const ADMIN_EMAIL = 'jambo5167@gmail.com';
export const ADMIN_PASSWORD = 'Dad4aderr';

async function performLogin(page: Page) {
	await page.goto('/admin/login');
	await page.waitForLoadState('networkidle');

	await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
	await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
	await page.locator('button[type="submit"]').click();

	await page.waitForURL('/admin', { timeout: 60000 });
}

export async function loginAsAdmin(page: Page) {
	// Check if already authenticated by visiting admin page
	await page.goto('/admin');

	if (page.url().includes('/admin/login')) {
		// Not authenticated, perform login
		await performLogin(page);
	}
}

export async function ensureAuthenticated(page: Page) {
	// Intercept 401 responses and re-login
	page.on('response', async (response) => {
		if (response.status() === 401) {
			console.log('Received 401, re-authenticating...');
			await page.context().clearCookies();
			await performLogin(page);
		}
	});
}

export async function logout(page: Page) {
	await page.context().clearCookies();
	await page.goto('/admin/login');
}
