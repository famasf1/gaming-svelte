import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const [
		articlesResult,
		publishedResult,
		categoriesResult,
		tagsResult,
		pagesResult,
		recentResult,
		trashResult
	] = await Promise.all([
		supabase.from('articles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase
			.from('articles')
			.select('*', { count: 'exact', head: true })
			.eq('is_published', true)
			.is('deleted_at', null),
		supabase.from('categories').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('tags').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('pages').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase
			.from('articles')
			.select('id, title, slug, is_published, published_at')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(5),
		supabase
			.from('articles')
			.select('id', { count: 'exact', head: true })
			.not('deleted_at', 'is', null)
	]);

	return {
		stats: {
			totalArticles: articlesResult.count ?? 0,
			publishedArticles: publishedResult.count ?? 0,
			categories: categoriesResult.count ?? 0,
			tags: tagsResult.count ?? 0,
			pages: pagesResult.count ?? 0,
			trash: trashResult.count ?? 0
		},
		recentArticles: recentResult.data ?? []
	};
};
