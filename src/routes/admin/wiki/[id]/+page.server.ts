import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	if (params.id && params.id !== 'new') {
		const { data: wiki } = await supabase
			.from('wiki')
			.select('*')
			.eq('id', Number(params.id))
			.single();

		if (wiki) {
			return { wiki };
		}
	}

	return { wiki: null };
};

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { supabase } = locals;
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const title = formData.get('title') as string;
		const slug = (formData.get('slug') as string) || generateSlug(title);
		const content = formData.get('content') as string;
		const game_title = formData.get('game_title') as string;
		const category = formData.get('category') as string;
		const is_published = formData.get('is_published') === 'on';

		const wikiData = {
			title,
			slug,
			content,
			game_title,
			category,
			is_published,
			updated_at: new Date().toISOString()
		};

		if (id) {
			const { error } = await supabase.from('wiki').update(wikiData).eq('id', id);
			if (error) {
				return fail(500, { message: error.message });
			}
		} else {
			const { error } = await supabase.from('wiki').insert(wikiData);
			if (error) {
				return fail(500, { message: error.message });
			}
		}

		return { success: true };
	}
};
