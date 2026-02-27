import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	if (params.id) {
		const { data: file } = await supabase.from('media').select('*').eq('id', params.id).single();

		return {
			file: file ?? null
		};
	}

	return {
		file: null
	};
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;

		if (!name) {
			return fail(400, { message: 'Name is required' });
		}

		const { supabase } = locals;

		const { error } = await supabase.from('media').update({ name }).eq('id', params.id);

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/media');
	},

	delete: async ({ params, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const { supabase } = locals;

		const { error } = await supabase
			.from('media')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', params.id);

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/media');
	}
};
