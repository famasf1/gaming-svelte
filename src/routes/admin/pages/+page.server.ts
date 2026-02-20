import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const filter = url.searchParams.get('filter') || 'all';
	let query = locals.supabase.from('pages').select('*').is('deleted_at', null);

	if (filter === 'published') {
		query = query.eq('is_published', true);
	} else if (filter === 'draft') {
		query = query.eq('is_published', false);
	}

	const { data: pages } = await query.order('created_at', { ascending: false });

	return { pages: pages ?? [] };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		const { error } = await locals.supabase
			.from('pages')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
