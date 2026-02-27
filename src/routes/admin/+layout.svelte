<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		User,
		LogOut,
		Star,
		FileText,
		Newspaper,
		BookOpen,
		Folder,
		Tags,
		File,
		MessageSquare,
		Settings,
		Users,
		Image,
		Trash2
	} from 'lucide-svelte';

	let { children, data } = $props();

	const user = $derived(data.user?.user_metadata ?? {});
	const displayName = $derived(user.display_name ?? data.user?.email ?? 'User');
	const avatarUrl = $derived(user.avatar_url ?? '');

	$effect(() => {
		if (!data.session && page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});
</script>

{#if data.session || page.url.pathname === '/admin/login'}
	{#if data.session}
		<div class="flex min-h-screen">
			<aside class="flex w-64 flex-col border-r bg-muted/50 p-4">
				<nav class="space-y-2">
					<a href="/admin" class="block rounded-lg px-3 py-2 hover:bg-muted">Dashboard</a>
					<hr class="my-2" />
					<div class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">Content</div>
					<a
						href="/admin/reviews"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Star class="h-4 w-4 text-yellow-500" />
						Reviews
					</a>
					<a
						href="/admin/features"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<FileText class="h-4 w-4 text-blue-500" />
						Features
					</a>
					<a href="/admin/news" class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
						<Newspaper class="h-4 w-4 text-green-500" />
						News
					</a>
					<a href="/admin/wiki" class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
						<BookOpen class="h-4 w-4 text-purple-500" />
						Wiki
					</a>
					<hr class="my-2" />
					<div class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
						Taxonomy
					</div>
					<a
						href="/admin/categories"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Folder class="h-4 w-4" />
						Categories
					</a>
					<a href="/admin/tags" class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
						<Tags class="h-4 w-4" />
						Tags
					</a>
					<a
						href="/admin/pages"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<File class="h-4 w-4" />
						Pages
					</a>
					<hr class="my-2" />
					<div class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
						Management
					</div>
					<a
						href="/admin/comments"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<MessageSquare class="h-4 w-4" />
						Comments
					</a>
					<a
						href="/admin/settings"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Settings class="h-4 w-4" />
						Settings
					</a>
					<a
						href="/admin/users"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Users class="h-4 w-4" />
						Users
					</a>
					<a
						href="/admin/media"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Image class="h-4 w-4" />
						Media
					</a>
					<a
						href="/admin/trash"
						class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
					>
						<Trash2 class="h-4 w-4" />
						Trash
					</a>
				</nav>

				<div class="mt-auto border-t pt-4">
					<div class="mb-3 flex items-center gap-3">
						{#if avatarUrl}
							<img src={avatarUrl} alt={displayName} class="h-10 w-10 rounded-full object-cover" />
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
							>
								<User class="h-5 w-5" />
							</div>
						{/if}
						<div class="flex-1 overflow-hidden">
							<p class="truncate text-sm font-medium">{displayName}</p>
						</div>
					</div>
					<div class="flex flex-col gap-1">
						<a href="/admin/profile" class="block rounded-lg px-3 py-2 text-sm hover:bg-muted">
							Profile
						</a>
						<form method="POST" action="/admin/profile?/logout">
							<button
								type="submit"
								class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
							>
								<LogOut class="h-4 w-4" />
								Logout
							</button>
						</form>
					</div>
				</div>
			</aside>
			<main class="flex-1 p-6">
				{@render children()}
			</main>
		</div>
	{:else}
		{@render children()}
	{/if}
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<p>Redirecting to login...</p>
	</div>
{/if}
