import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	if (params.id && params.id !== 'new') {
		const { data: review } = await supabase
			.from('reviews')
			.select('*')
			.eq('id', Number(params.id))
			.single();

		if (review) {
			return { review };
		}
	}

	return { review: null };
};

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { supabase } = locals;
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string) || generateSlug(title);
		const content = formData.get('content') as string;
		const excerpt = formData.get('excerpt') as string;
		const featured_image = formData.get('featured_image') as string;
		const rating = formData.get('rating') ? Number(formData.get('rating')) : null;
		const game_title = formData.get('game_title') as string;
		const game_platform = formData.get('game_platform') as string;
		const is_published = formData.get('is_published') === 'on';
		const published_at = formData.get('published_at') as string;
		const meta_title = formData.get('meta_title') as string;
		const meta_description = formData.get('meta_description') as string;
		const meta_image = formData.get('meta_image') as string;

		const reviewData = {
			title,
			slug,
			content,
			excerpt,
			featured_image,
			rating,
			game_title,
			game_platform,
			author_id: locals.session.user.id,
			is_published,
			published_at: is_published ? published_at || new Date().toISOString() : null,
			meta_title,
			meta_description,
			meta_image,
			updated_at: new Date().toISOString()
		};

		if (id) {
			const { error } = await supabase.from('reviews').update(reviewData).eq('id', id);
			if (error) {
				return fail(500, { message: error.message });
			}
		} else {
			const { error } = await supabase.from('reviews').insert(reviewData);
			if (error) {
				return fail(500, { message: error.message });
			}
		}

		return { success: true };
	}
};
