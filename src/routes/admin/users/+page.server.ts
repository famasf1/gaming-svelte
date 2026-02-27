import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const { supabase } = locals;

	const { data: users } = await supabase.auth.admin.listUsers();

	const userList =
		users?.users.map((user) => ({
			id: user.id,
			email: user.email,
			created_at: user.created_at,
			email_confirmed_at: user.email_confirmed_at,
			last_sign_in_at: user.last_sign_in_at
		})) ?? [];

	return { users: userList };
};
