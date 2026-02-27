import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { data: news } = await locals.supabase
		.from('news')
		.select('*')
		.is('deleted_at', null)
		.order('created_at', { ascending: false });

	return { news: news ?? [] };
};

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string) || generateSlug(title);
		const summary = formData.get('summary') as string;
		const source_url = formData.get('source_url') as string;
		const game_tags = formData.get('game_tags')
			? JSON.parse(formData.get('game_tags') as string)
			: [];
		const is_published = formData.get('is_published') === 'on';

		const { error } = await locals.supabase.from('news').insert({
			title,
			slug,
			summary,
			source_url,
			game_tags,
			is_published,
			published_at: is_published ? new Date().toISOString() : null
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	},

	update: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string) || generateSlug(title);
		const summary = formData.get('summary') as string;
		const source_url = formData.get('source_url') as string;
		const game_tags = formData.get('game_tags')
			? JSON.parse(formData.get('game_tags') as string)
			: [];
		const is_published = formData.get('is_published') === 'on';

		const { error } = await locals.supabase
			.from('news')
			.update({
				title,
				slug,
				summary,
				source_url,
				game_tags,
				is_published,
				published_at: is_published ? new Date().toISOString() : null,
				updated_at: new Date().toISOString()
			})
			.eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await locals.supabase
			.from('news')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		return { success: true };
	}
};
