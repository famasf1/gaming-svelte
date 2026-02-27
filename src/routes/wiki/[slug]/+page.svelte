<script lang="ts">
	let { data } = $props();

	const articleUrl = $derived(typeof window !== 'undefined' ? window.location.href : '');
</script>

<svelte:head>
	<title>{data.wiki.title} - Gaming News Blog Wiki</title>
	<meta name="description" content="Wiki entry for {data.wiki.game_title || data.wiki.title}" />

	<meta property="og:title" content={data.wiki.title} />
	<meta
		property="og:description"
		content="Wiki entry for {data.wiki.game_title || data.wiki.title}"
	/>
	<meta property="og:type" content="article" />

	<link rel="canonical" href={articleUrl} />
</svelte:head>

{#if data.wiki}
	<article class="mx-auto max-w-3xl space-y-6">
		<header class="space-y-4">
			<h1 class="text-4xl font-bold">{data.wiki.title}</h1>
			<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				{#if data.wiki.game_title}
					<span class="rounded-full bg-muted px-3 py-1">{data.wiki.game_title}</span>
				{/if}
				{#if data.wiki.category}
					<span class="rounded-full bg-primary/10 px-3 py-1 text-primary capitalize"
						>{data.wiki.category}</span
					>
				{/if}
			</div>
		</header>

		<div class="prose max-w-none">
			{@html data.wiki.content || ''}
		</div>
	</article>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold">Wiki entry not found</h1>
		<p class="text-muted-foreground">This wiki entry may have been removed or moved.</p>
	</div>
{/if}
