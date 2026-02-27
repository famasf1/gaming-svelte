import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	if (params.id) {
		const { data: page } = await supabase.from('pages').select('*').eq('id', params.id).single();

		return {
			page: page ?? null
		};
	}

	return {
		page: null
	};
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const content = formData.get('content') as string;
		const template = formData.get('template') as string;
		const is_published = formData.get('is_published') === 'on';
		const meta_title = formData.get('meta_title') as string;
		const meta_description = formData.get('meta_description') as string;
		const meta_image = formData.get('meta_image') as string;

		if (!title || !slug || !content) {
			return fail(400, { message: 'Title, slug, and content are required' });
		}

		const { supabase } = locals;

		let slugQuery = supabase.from('pages').select('id').eq('slug', slug).is('deleted_at', null);

		if (params.id) {
			slugQuery = slugQuery.neq('id', Number(params.id));
		}

		const { data: existingSlug } = await slugQuery.maybeSingle();

		if (existingSlug) {
			return fail(400, { message: 'Slug already exists. Please use a different slug.' });
		}

		const pageData = {
			title,
			slug,
			content,
			template: template || null,
			is_published,
			meta_title: meta_title || null,
			meta_description: meta_description || null,
			meta_image: meta_image || null,
			...(is_published ? { published_at: new Date().toISOString() } : {}),
			updated_at: new Date().toISOString()
		};

		if (params.id) {
			const { error } = await supabase.from('pages').update(pageData).eq('id', params.id);

			if (error) {
				return fail(500, { message: error.message });
			}
		} else {
			const { error } = await supabase.from('pages').insert({
				...pageData,
				published_at: is_published ? new Date().toISOString() : null
			});

			if (error) {
				return fail(500, { message: error.message });
			}
		}

		throw redirect(303, '/admin/pages');
	},

	delete: async ({ params, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { supabase } = locals;

		const { error } = await supabase
			.from('pages')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', params.id);

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/pages');
	}
};
