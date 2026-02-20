<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold">Dashboard</h1>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="text-sm text-muted-foreground">Total Articles</div>
			<div class="text-2xl font-bold">{data.stats.totalArticles}</div>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="text-sm text-muted-foreground">Published</div>
			<div class="text-2xl font-bold">{data.stats.publishedArticles}</div>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="text-sm text-muted-foreground">Categories</div>
			<div class="text-2xl font-bold">{data.stats.categories}</div>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="text-sm text-muted-foreground">Pages</div>
			<div class="text-2xl font-bold">{data.stats.pages}</div>
		</div>
	</div>

	{#if data.stats.trash > 0}
		<a
			href="/admin/trash"
			class="block rounded-lg border border-dashed p-4 text-center text-muted-foreground hover:bg-muted"
		>
			{data.stats.trash} item{data.stats.trash > 1 ? 's' : ''} in Trash
		</a>
	{/if}

	<div class="rounded-lg border">
		<div class="border-b bg-muted/50 px-4 py-3">
			<h2 class="font-semibold">Recent Articles</h2>
		</div>
		{#if data.recentArticles.length > 0}
			<div class="divide-y">
				{#each data.recentArticles as article}
					<a
						href="/admin/articles/{article.id}"
						class="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
					>
						<div>
							<div class="font-medium">{article.title}</div>
							<div class="text-sm text-muted-foreground">
								{article.is_published ? 'Published' : 'Draft'}
							</div>
						</div>
						<span class="text-sm text-muted-foreground">
							{article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}
						</span>
					</a>
				{/each}
			</div>
		{:else}
			<div class="px-4 py-8 text-center text-muted-foreground">
				No articles yet. <a href="/admin/articles/new" class="text-primary hover:underline"
					>Create one</a
				>
			</div>
		{/if}
	</div>
</div>
