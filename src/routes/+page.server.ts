import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: articles } = await locals.supabase
		.from('articles')
		.select('id, title, slug, excerpt, featured_image, published_at')
		.eq('is_published', true)
		.order('published_at', { ascending: false })
		.limit(12);

	return { articles: articles ?? [] };
};
