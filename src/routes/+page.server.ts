import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	const [newsResult, reviewsResult, featuresResult] = await Promise.all([
		supabase
			.from('news')
			.select('id, title, slug, summary, source_url, game_tags, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(10),
		supabase
			.from('reviews')
			.select('id, title, slug, excerpt, featured_image, rating, game_title, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(6),
		supabase
			.from('features')
			.select('id, title, slug, excerpt, featured_image, feature_image, published_at')
			.eq('is_published', true)
			.order('published_at', { ascending: false })
			.limit(6)
	]);

	const { data: settings } = await supabase.from('settings').select('key, value');
	const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

	return {
		news: newsResult.data ?? [],
		reviews: reviewsResult.data ?? [],
		features: featuresResult.data ?? [],
		settings: settingsMap
	};
};

export const actions: Actions = {
	subscribe: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { message: 'Email is required' });
		}

		const { supabase } = locals;

		const { error } = await supabase
			.from('news_subscriptions')
			.upsert({ email }, { onConflict: 'email' });

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
