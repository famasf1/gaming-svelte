import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const [articles, pages, categories, tags] = await Promise.all([
		supabase
			.from('articles')
			.select('id, title, deleted_at')
			.not('deleted_at', 'is', null)
			.order('deleted_at', { ascending: false }),
		supabase
			.from('pages')
			.select('id, title, deleted_at')
			.not('deleted_at', 'is', null)
			.order('deleted_at', { ascending: false }),
		supabase
			.from('categories')
			.select('id, name, deleted_at')
			.not('deleted_at', 'is', null)
			.order('deleted_at', { ascending: false }),
		supabase
			.from('tags')
			.select('id, name, deleted_at')
			.not('deleted_at', 'is', null)
			.order('deleted_at', { ascending: false })
	]);

	return {
		articles: articles.data ?? [],
		pages: pages.data ?? [],
		categories: categories.data ?? [],
		tags: tags.data ?? []
	};
};

export const actions: Actions = {
	restore: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const type = formData.get('type') as string;
		const id = Number(formData.get('id'));

		if (!type || !id) {
			return fail(400, { message: 'Type and ID are required' });
		}

		const { error } = await locals.supabase.from(type).update({ deleted_at: null }).eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	},

	purge: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const type = formData.get('type') as string;
		const id = Number(formData.get('id'));

		if (!type || !id) {
			return fail(400, { message: 'Type and ID are required' });
		}

		const { error } = await locals.supabase.from(type).delete().eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
