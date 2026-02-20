import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { data: categories } = await locals.supabase
		.from('categories')
		.select('*')
		.is('deleted_at', null)
		.order('name');

	return { categories: categories ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!name) {
			return fail(400, { message: 'Name is required' });
		}

		const slug = name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-');

		const { error } = await locals.supabase.from('categories').insert({
			name,
			slug,
			description: description || null
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
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		if (!id || !name) {
			return fail(400, { message: 'ID and name are required' });
		}

		const slug = name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-');

		const { error } = await locals.supabase
			.from('categories')
			.update({ name, slug, description: description || null })
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

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		const { error } = await locals.supabase
			.from('categories')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
