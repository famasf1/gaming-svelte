import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const filter = url.searchParams.get('filter') || 'pending';

	let query = locals.supabase
		.from('comments')
		.select('*, articles(title, slug)')
		.order('created_at', { ascending: false });

	if (filter === 'approved') {
		query = query.eq('is_approved', true);
	} else if (filter === 'pending') {
		query = query.eq('is_approved', false);
	}

	const { data: comments } = await query;

	return { comments: comments ?? [], filter };
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await locals.supabase
			.from('comments')
			.update({ is_approved: true, needs_moderation: false })
			.eq('id', id);

		return { success: true };
	},

	reject: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await locals.supabase.from('comments').delete().eq('id', id);

		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await locals.supabase.from('comments').delete().eq('id', id);

		return { success: true };
	}
};
