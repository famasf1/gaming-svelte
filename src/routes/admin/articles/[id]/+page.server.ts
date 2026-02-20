import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const [categories, tags] = await Promise.all([
		supabase.from('categories').select('*').eq('deleted_at', null),
		supabase.from('tags').select('*').eq('deleted_at', null)
	]);

	if (params.id) {
		const { data: article } = await supabase
			.from('articles')
			.select('*, article_categories(category_id), article_tags(tag_id)')
			.eq('id', params.id)
			.single();

		return {
			article: article ?? null,
			categories: categories.data ?? [],
			tags: tags.data ?? []
		};
	}

	return {
		article: null,
		categories: categories.data ?? [],
		tags: tags.data ?? []
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
		const excerpt = formData.get('excerpt') as string;
		const featured_image = formData.get('featured_image') as string;
		const is_published = formData.get('is_published') === 'on';
		const categoryIds = formData.getAll('categories').map(Number);
		const tagIds = formData.getAll('tags').map(Number);

		if (!title || !slug || !content) {
			return fail(400, { message: 'Title, slug, and content are required' });
		}

		const { supabase } = locals;

		const articleData = {
			title,
			slug,
			content,
			excerpt: excerpt || null,
			featured_image: featured_image || null,
			is_published,
			published_at: is_published ? new Date().toISOString() : null,
			author_id: locals.user?.id,
			...(params.id ? {} : { created_at: new Date().toISOString() })
		};

		let articleId = params.id;

		if (params.id) {
			const { error } = await supabase
				.from('articles')
				.update({ ...articleData, updated_at: new Date().toISOString() })
				.eq('id', params.id);

			if (error) {
				return fail(500, { message: error.message });
			}
		} else {
			const { data, error } = await supabase.from('articles').insert(articleData).select().single();

			if (error) {
				return fail(500, { message: error.message });
			}

			articleId = data?.id;
		}

		if (articleId) {
			await supabase.from('article_categories').delete().eq('article_id', articleId);
			await supabase.from('article_tags').delete().eq('article_id', articleId);

			if (categoryIds.length > 0) {
				await supabase
					.from('article_categories')
					.insert(categoryIds.map((catId) => ({ article_id: articleId, category_id: catId })));
			}

			if (tagIds.length > 0) {
				await supabase
					.from('article_tags')
					.insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
			}
		}

		throw redirect(303, '/admin/articles');
	},

	delete: async ({ params, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { supabase } = locals;

		const { error } = await supabase
			.from('articles')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', params.id);

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/articles');
	}
};
