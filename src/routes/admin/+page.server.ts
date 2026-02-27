import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const [
		reviewsResult,
		publishedReviewsResult,
		featuresResult,
		publishedFeaturesResult,
		newsResult,
		wikiResult,
		categoriesResult,
		tagsResult,
		pagesResult,
		recentReviewsResult,
		recentFeaturesResult,
		trashResult,
		pendingCommentsResult
	] = await Promise.all([
		supabase.from('reviews').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase
			.from('reviews')
			.select('*', { count: 'exact', head: true })
			.eq('is_published', true)
			.is('deleted_at', null),
		supabase.from('features').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase
			.from('features')
			.select('*', { count: 'exact', head: true })
			.eq('is_published', true)
			.is('deleted_at', null),
		supabase.from('news').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('wiki').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('categories').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('tags').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase.from('pages').select('*', { count: 'exact', head: true }).is('deleted_at', null),
		supabase
			.from('reviews')
			.select('id, title, slug, is_published, published_at, rating, game_title')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(5),
		supabase
			.from('features')
			.select('id, title, slug, is_published, published_at')
			.is('deleted_at', null)
			.order('created_at', { ascending: false })
			.limit(5),
		supabase
			.from('reviews')
			.select('id', { count: 'exact', head: true })
			.not('deleted_at', 'is', null),
		supabase.from('comments').select('id', { count: 'exact', head: true }).eq('is_approved', false)
	]);

	return {
		stats: {
			reviews: reviewsResult.count ?? 0,
			publishedReviews: publishedReviewsResult.count ?? 0,
			features: featuresResult.count ?? 0,
			publishedFeatures: publishedFeaturesResult.count ?? 0,
			news: newsResult.count ?? 0,
			wiki: wikiResult.count ?? 0,
			categories: categoriesResult.count ?? 0,
			tags: tagsResult.count ?? 0,
			pages: pagesResult.count ?? 0,
			trash: trashResult.count ?? 0,
			pendingComments: pendingCommentsResult.count ?? 0
		},
		recentReviews: recentReviewsResult.data ?? [],
		recentFeatures: recentFeaturesResult.data ?? []
	};
};
