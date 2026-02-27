import { chromium, type Browser } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ADMIN_EMAIL = 'jambo5167@gmail.com';
const ADMIN_PASSWORD = 'Dad4aderr';
const BASE_URL = 'http://localhost:4173';
const STORAGE_STATE_PATH = join(dirname(fileURLToPath(import.meta.url)), '.auth', 'admin.json');

async function globalSetup() {
	console.log('Starting global setup - logging in as admin...');

	const browser: Browser = await chromium.launch({ headless: true });
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		// Navigate to login page
		await page.goto(`${BASE_URL}/admin/login`);
		await page.waitForLoadState('networkidle');

		// Fill in credentials
		await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
		await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);

		// Click login button
		await page.locator('button[type="submit"]').click();

		// Wait for navigation to admin dashboard
		await page.waitForURL(/\/admin(\/|$)/, { timeout: 60000 });

		console.log('Login successful!');

		// Save storage state (cookies, localStorage, etc.)
		await context.storageState({ path: STORAGE_STATE_PATH });
		console.log(`Storage state saved to: ${STORAGE_STATE_PATH}`);
	} catch (error) {
		console.error('Failed to login during global setup:', error);
		throw error;
	} finally {
		await browser.close();
	}

	console.log('Global setup complete!');
}

export default globalSetup;
