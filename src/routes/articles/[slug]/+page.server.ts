import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

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

	const [commentsResult, settingsResult] = await Promise.all([
		locals.supabase
			.from('comments')
			.select('*')
			.eq('article_id', article.id)
			.eq('is_approved', true)
			.order('created_at', { ascending: false }),
		locals.supabase.from('settings').select('key, value')
	]);

	const settings: Record<string, string> = {};
	settingsResult.data?.forEach((s) => {
		settings[s.key] = s.value;
	});

	return {
		article,
		comments: commentsResult.data ?? [],
		settings
	};
};

export const actions: Actions = {
	createComment: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const content = formData.get('content') as string;

		if (!name || !email || !content) {
			return fail(400, { message: 'All fields are required' });
		}

		const { data: article } = await locals.supabase
			.from('articles')
			.select('id')
			.eq('slug', params.slug)
			.single();

		if (!article) {
			return fail(404, { message: 'Article not found' });
		}

		const { data: settings } = await locals.supabase
			.from('settings')
			.select('value')
			.eq('key', 'comments_require_approval')
			.single();

		const needsModeration = settings?.value !== 'false';

		const { error } = await locals.supabase.from('comments').insert({
			article_id: article.id,
			name,
			email,
			content,
			is_approved: !needsModeration,
			needs_moderation: needsModeration
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true, needsModeration };
	}
};
