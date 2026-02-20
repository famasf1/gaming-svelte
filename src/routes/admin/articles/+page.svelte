<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	const filter = $derived(page.url.searchParams.get('filter') || 'all');
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Articles</h1>
		<a
			href="/admin/articles/new"
			class="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
		>
			New Article
		</a>
	</div>

	<div class="flex gap-2">
		<a
			href="/admin/articles?filter=all"
			class="rounded-lg px-3 py-1 {filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			All
		</a>
		<a
			href="/admin/articles?filter=published"
			class="rounded-lg px-3 py-1 {filter === 'published'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Published
		</a>
		<a
			href="/admin/articles?filter=draft"
			class="rounded-lg px-3 py-1 {filter === 'draft'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Drafts
		</a>
	</div>

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Title</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Published</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.articles && data.articles.length > 0}
					{#each data.articles as article}
						<tr class="border-b">
							<td class="px-4 py-3 font-medium">{article.title}</td>
							<td class="px-4 py-3">
								<Badge variant={article.is_published ? 'default' : 'secondary'}>
									{article.is_published ? 'Published' : 'Draft'}
								</Badge>
							</td>
							<td class="px-4 py-3 text-muted-foreground">
								{article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a
										href="/admin/articles/{article.id}"
										class="text-sm text-primary hover:underline"
									>
										Edit
									</a>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="4" class="px-4 py-8 text-center text-muted-foreground">
							No articles found.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
