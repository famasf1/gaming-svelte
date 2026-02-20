import type { User, Session } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient;
			session: Session | null;
			user: User | null;
		}
	}
}

export {};
