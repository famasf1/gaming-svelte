import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { supabase } = locals;

	const { data: feature } = await supabase
		.from('features')
		.select('*')
		.eq('slug', params.slug)
		.eq('is_published', true)
		.is('deleted_at', null)
		.single();

	if (!feature) {
		throw new Error('Feature not found');
	}

	const { data: settings } = await supabase.from('settings').select('key, value');
	const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

	return { feature, settings: settingsMap };
};
