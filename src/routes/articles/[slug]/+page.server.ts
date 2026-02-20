import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data: article } = await locals.supabase
		.from('articles')
		.select('*')
		.eq('slug', params.slug)
		.eq('is_published', true)
		.single();

	if (!article) {
		throw error(404, 'Article not found');
	}

	return { article };
};
