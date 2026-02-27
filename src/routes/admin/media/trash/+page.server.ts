import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const { data: files } = await supabase
		.from('media')
		.select('*')
		.not('deleted_at', 'is', null)
		.order('deleted_at', { ascending: false });

	return { files: files ?? [] };
};

export const actions: Actions = {
	restore: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { message: 'No file ID provided' });
		}

		const { supabase } = locals;

		const { error } = await supabase.from('media').update({ deleted_at: null }).eq('id', id);

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
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'No file ID provided' });
		}

		const { supabase } = locals;

		const { data: file } = await supabase.from('media').select('url').eq('id', id).single();

		if (file) {
			const path = file.url.split('/object/public/articles-img/')[1];
			if (path) {
				await supabase.storage.from('articles-img').remove([path]);
			}
		}

		const { error } = await supabase.from('media').delete().eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
