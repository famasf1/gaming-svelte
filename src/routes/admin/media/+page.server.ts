import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { data: files } = await locals.supabase.storage.from('articles-img').list('uploads', {
		limit: 100,
		sortBy: { column: 'name', order: 'desc' }
	});

	return { files: files ?? [] };
};
