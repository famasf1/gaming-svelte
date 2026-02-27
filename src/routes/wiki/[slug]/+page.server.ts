import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { supabase } = locals;

	const { data: wiki } = await supabase
		.from('wiki')
		.select('*')
		.eq('slug', params.slug)
		.eq('is_published', true)
		.is('deleted_at', null)
		.single();

	if (!wiki) {
		throw new Error('Wiki entry not found');
	}

	const { data: settings } = await supabase.from('settings').select('key, value');
	const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

	return { wiki, settings: settingsMap };
};
