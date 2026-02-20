<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Gaming News Blog</title>
</svelte:head>

<div class="space-y-8">
	<section>
		<h1 class="mb-6 text-4xl font-bold">Latest News</h1>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#if data.articles && data.articles.length > 0}
				{#each data.articles as article}
					<a
						href="/articles/{article.slug}"
						class="group rounded-lg border bg-card transition-colors hover:border-primary"
					>
						{#if article.featured_image}
							<img
								src={article.featured_image}
								alt={article.title}
								class="aspect-video w-full rounded-t-lg object-cover"
							/>
						{:else}
							<div class="aspect-video w-full rounded-t-lg bg-muted"></div>
						{/if}
						<div class="p-4">
							<h2 class="mb-2 text-lg font-semibold group-hover:text-primary">{article.title}</h2>
							{#if article.excerpt}
								<p class="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			{:else}
				<div class="col-span-full rounded-lg border bg-muted/50 p-12 text-center">
					<p class="text-muted-foreground">No articles published yet. Check back soon!</p>
				</div>
			{/if}
		</div>
	</section>
</div>
