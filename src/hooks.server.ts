import { paraglideMiddleware } from '$lib/paraglide/server';
import { supabaseServerClient } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleSupabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = supabaseServerClient(event);

	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	return handleParaglide({ event, resolve: (e) => handleSupabase({ event: e, resolve }) });
};
