import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/admin/login');
	}

	const user = locals.user;
	const profile = user?.user_metadata ?? {};

	return {
		user: {
			id: user?.id,
			email: user?.email,
			display_name: profile.display_name ?? '',
			avatar_url: profile.avatar_url ?? '',
			bio: profile.bio ?? '',
			facebook: profile.social_facebook ?? '',
			twitter: profile.social_twitter ?? '',
			youtube: profile.social_youtube ?? '',
			twitch: profile.social_twitch ?? '',
			discord: profile.social_discord ?? '',
			instagram: profile.social_instagram ?? '',
			linkedin: profile.social_linkedin ?? '',
			github: profile.social_github ?? ''
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const display_name = formData.get('display_name') as string;
		const avatar_url = formData.get('avatar_url') as string;
		const bio = formData.get('bio') as string;
		const facebook = formData.get('facebook') as string;
		const twitter = formData.get('twitter') as string;
		const youtube = formData.get('youtube') as string;
		const twitch = formData.get('twitch') as string;
		const discord = formData.get('discord') as string;
		const instagram = formData.get('instagram') as string;
		const linkedin = formData.get('linkedin') as string;
		const github = formData.get('github') as string;

		const { error } = await locals.supabase.auth.updateUser({
			data: {
				display_name,
				avatar_url,
				bio,
				social_facebook: facebook,
				social_twitter: twitter,
				social_youtube: youtube,
				social_twitch: twitch,
				social_discord: discord,
				social_instagram: instagram,
				social_linkedin: linkedin,
				social_github: github
			}
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true, message: 'Profile saved successfully!' };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const current_password = formData.get('current_password') as string;
		const new_password = formData.get('new_password') as string;

		if (!current_password || !new_password) {
			return fail(400, { message: 'Current and new password are required' });
		}

		if (new_password.length < 6) {
			return fail(400, { message: 'Password must be at least 6 characters' });
		}

		const { error } = await locals.supabase.auth.updateUser({
			password: new_password
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true, message: 'Password changed successfully!' };
	},

	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
