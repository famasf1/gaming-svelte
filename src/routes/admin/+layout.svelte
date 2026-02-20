<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	$effect(() => {
		if (!data.session && page.url.pathname !== '/admin/login') {
			goto('/admin/login');
		}
	});
</script>

{#if data.session || page.url.pathname === '/admin/login'}
	{#if data.session}
		<div class="flex min-h-screen">
			<aside class="w-64 border-r bg-muted/50 p-4">
				<nav class="space-y-2">
					<a href="/admin" class="block rounded-lg px-3 py-2 hover:bg-muted">Dashboard</a>
					<a href="/admin/articles" class="block rounded-lg px-3 py-2 hover:bg-muted">Articles</a>
					<a href="/admin/categories" class="block rounded-lg px-3 py-2 hover:bg-muted"
						>Categories</a
					>
					<a href="/admin/tags" class="block rounded-lg px-3 py-2 hover:bg-muted">Tags</a>
					<a href="/admin/pages" class="block rounded-lg px-3 py-2 hover:bg-muted">Pages</a>
					<hr class="my-2" />
					<a href="/admin/media" class="block rounded-lg px-3 py-2 hover:bg-muted">Media</a>
					<a href="/admin/trash" class="block rounded-lg px-3 py-2 hover:bg-muted">Trash</a>
				</nav>
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
