import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const [categories, tags] = await Promise.all([
		supabase.from('categories').select('*').eq('deleted_at', null),
		supabase.from('tags').select('*').eq('deleted_at', null)
	]);

	return {
		article: null,
		categories: categories.data ?? [],
		tags: tags.data ?? []
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
		const excerpt = formData.get('excerpt') as string;
		const featured_image = formData.get('featured_image') as string;
		const is_published = formData.get('is_published') === 'on';
		const categoryIds = formData.getAll('categories').map(Number);
		const tagIds = formData.getAll('tags').map(Number);

		if (!title || !slug || !content) {
			return fail(400, { message: 'Title, slug, and content are required' });
		}

		const { supabase } = locals;

		const { data, error } = await supabase
			.from('articles')
			.insert({
				title,
				slug,
				content,
				excerpt: excerpt || null,
				featured_image: featured_image || null,
				is_published,
				published_at: is_published ? new Date().toISOString() : null,
				author_id: locals.user?.id
			})
			.select()
			.single();

		if (error) {
			return fail(500, { message: error.message });
		}

		if (data?.id) {
			if (categoryIds.length > 0) {
				await supabase
					.from('article_categories')
					.insert(categoryIds.map((catId) => ({ article_id: data.id, category_id: catId })));
			}

			if (tagIds.length > 0) {
				await supabase
					.from('article_tags')
					.insert(tagIds.map((tagId) => ({ article_id: data.id, tag_id: tagId })));
			}
		}

		throw redirect(303, '/admin/articles');
	}
};
