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
		.is('deleted_at', null)
		.order('created_at', { ascending: false });

	return { files: files ?? [] };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file || file.size === 0) {
			return fail(400, { message: 'No file provided' });
		}

		const { supabase } = locals;

		const fileExt = file.name.split('.').pop();
		const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
		const filePath = `uploads/${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from('articles-img')
			.upload(filePath, file);

		if (uploadError) {
			return fail(500, { message: uploadError.message });
		}

		const { data: urlData } = supabase.storage.from('articles-img').getPublicUrl(filePath);

		const { error: dbError } = await supabase.from('media').insert({
			name: file.name,
			url: urlData.publicUrl,
			size: file.size,
			mime_type: file.type
		});

		if (dbError) {
			return fail(500, { message: dbError.message });
		}

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { message: 'No file ID provided' });
		}

		const { supabase } = locals;

		const { error } = await supabase
			.from('media')
			.update({ deleted_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
