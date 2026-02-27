import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const filter = url.searchParams.get('filter') || 'all';
	let query = locals.supabase
		.from('wiki')
		.select('id, title, slug, is_published, game_title, category, deleted_at')
		.is('deleted_at', null);

	if (filter === 'published') {
		query = query.eq('is_published', true);
	} else if (filter === 'draft') {
		query = query.eq('is_published', false);
	}

	const { data: wiki } = await query.order('created_at', { ascending: false });

	return { wiki: wiki ?? [], filter };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await locals.supabase
			.from('wiki')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		return { success: true };
	}
};
