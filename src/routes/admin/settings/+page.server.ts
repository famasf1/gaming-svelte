import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { data: settings } = await locals.supabase.from('settings').select('*');

	const settingsMap: Record<string, { value: string; description: string }> = {};
	settings?.forEach((s) => {
		settingsMap[s.key] = { value: s.value ?? '', description: s.description ?? '' };
	});

	return { settings: settingsMap };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const entries = Array.from(formData.entries());

		for (const [key, value] of entries) {
			await locals.supabase
				.from('settings')
				.update({ value: value as string, updated_at: new Date().toISOString() })
				.eq('key', key);
		}

		return { success: true };
	}
};
