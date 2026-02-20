import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const filter = url.searchParams.get('filter') || 'all';
	let query = locals.supabase
		.from('articles')
		.select('id, title, slug, is_published, published_at, deleted_at')
		.is('deleted_at', null);

	if (filter === 'published') {
		query = query.eq('is_published', true);
	} else if (filter === 'draft') {
		query = query.eq('is_published', false);
	}

	const { data: articles } = await query.order('created_at', { ascending: false });

	return { articles: articles ?? [] };
};
