import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { data: tags } = await locals.supabase
		.from('tags')
		.select('*')
		.is('deleted_at', null)
		.order('name');

	return { tags: tags ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;

		if (!name) {
			return fail(400, { message: 'Name is required' });
		}

		const slug = name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-');

		const { error } = await locals.supabase.from('tags').insert({ name, slug });

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

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		const { error } = await locals.supabase
			.from('tags')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
