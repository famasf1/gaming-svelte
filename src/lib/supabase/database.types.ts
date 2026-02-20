export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			articles: {
				Row: {
					id: number;
					title: string;
					slug: string;
					content: string;
					excerpt: string | null;
					featured_image: string | null;
					published_at: string | null;
					is_published: boolean;
					created_at: string;
					updated_at: string;
					author_id: string;
				};
				Insert: {
					id?: number;
					title: string;
					slug: string;
					content: string;
					excerpt?: string | null;
					featured_image?: string | null;
					published_at?: string | null;
					is_published?: boolean;
					created_at?: string;
					updated_at?: string;
					author_id: string;
				};
				Update: {
					id?: number;
					title?: string;
					slug?: string;
					content?: string;
					excerpt?: string | null;
					featured_image?: string | null;
					published_at?: string | null;
					is_published?: boolean;
					created_at?: string;
					updated_at?: string;
					author_id?: string;
				};
			};
			categories: {
				Row: {
					id: number;
					name: string;
					slug: string;
					description: string | null;
					created_at: string;
				};
				Insert: {
					id?: number;
					name: string;
					slug: string;
					description?: string | null;
					created_at?: string;
				};
				Update: {
					id?: number;
					name?: string;
					slug?: string;
					description?: string | null;
					created_at?: string;
				};
			};
			tags: {
				Row: {
					id: number;
					name: string;
					slug: string;
					created_at: string;
				};
				Insert: {
					id?: number;
					name: string;
					slug: string;
					created_at?: string;
				};
				Update: {
					id?: number;
					name?: string;
					slug?: string;
					created_at?: string;
				};
			};
			article_categories: {
				Row: {
					article_id: number;
					category_id: number;
				};
				Insert: {
					article_id: number;
					category_id: number;
				};
				Update: {
					article_id?: number;
					category_id?: number;
				};
			};
			article_tags: {
				Row: {
					article_id: number;
					tag_id: number;
				};
				Insert: {
					article_id: number;
					tag_id: number;
				};
				Update: {
					article_id?: number;
					tag_id?: number;
				};
			};
			pages: {
				Row: {
					id: number;
					title: string;
					slug: string;
					content: string;
					template: string | null;
					published_at: string | null;
					is_published: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					title: string;
					slug: string;
					content: string;
					template?: string | null;
					published_at?: string | null;
					is_published?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					title?: string;
					slug?: string;
					content?: string;
					template?: string | null;
					published_at?: string | null;
					is_published?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
