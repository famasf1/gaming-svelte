import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { supabase } = locals;

	const { data: review } = await supabase
		.from('reviews')
		.select('*')
		.eq('slug', params.slug)
		.eq('is_published', true)
		.is('deleted_at', null)
		.single();

	if (!review) {
		throw new Error('Review not found');
	}

	const { data: settings } = await supabase.from('settings').select('key, value');
	const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

	return { review, settings: settingsMap };
};
