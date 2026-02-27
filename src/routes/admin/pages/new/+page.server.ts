import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	return {
		page: null
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const content = formData.get('content') as string;
		const template = formData.get('template') as string;
		const is_published =
			formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

		if (!title || !slug || !content) {
			return fail(400, { message: 'Title, slug, and content are required' });
		}

		const { supabase } = locals;

		const { data: existingSlug } = await supabase
			.from('pages')
			.select('id')
			.eq('slug', slug)
			.is('deleted_at', null)
			.maybeSingle();

		if (existingSlug) {
			return fail(400, { message: 'Slug already exists. Please use a different slug.' });
		}

		const { error } = await supabase.from('pages').insert({
			title,
			slug,
			content,
			template: template || null,
			is_published,
			published_at: is_published ? new Date().toISOString() : null
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/pages');
	}
};
