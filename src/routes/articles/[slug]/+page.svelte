<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.article?.title ?? 'Article'} - Gaming News Blog</title>
</svelte:head>

{#if data.article}
	<article class="mx-auto max-w-3xl space-y-6">
		<header class="space-y-4">
			<h1 class="text-4xl font-bold">{data.article.title}</h1>
			{#if data.article.published_at}
				<time class="text-sm text-muted-foreground">
					{new Date(data.article.published_at).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</time>
			{/if}
		</header>

		{#if data.article.featured_image}
			<img src={data.article.featured_image} alt={data.article.title} class="w-full rounded-lg" />
		{/if}

		<div class="prose max-w-none prose-zinc dark:prose-invert">
			{@html data.article.content}
		</div>
	</article>
{:else}
	<div class="text-center">
		<h1 class="text-2xl font-bold">Article not found</h1>
		<a href="/" class="text-primary hover:underline">Back to home</a>
	</div>
{/if}
