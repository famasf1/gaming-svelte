<script lang="ts">
	let { data } = $props();

	const articleUrl = $derived(typeof window !== 'undefined' ? window.location.href : '');
</script>

<svelte:head>
	<title>{data.feature.meta_title || data.feature.title} - Gaming News Blog</title>
	<meta name="description" content={data.feature.meta_description || data.feature.excerpt || ''} />

	<meta property="og:title" content={data.feature.meta_title || data.feature.title} />
	<meta
		property="og:description"
		content={data.feature.meta_description || data.feature.excerpt || ''}
	/>
	<meta
		property="og:image"
		content={data.feature.meta_image ||
			data.feature.featured_image ||
			data.feature.feature_image ||
			''}
	/>
	<meta property="og:type" content="article" />

	<link rel="canonical" href={articleUrl} />
</svelte:head>

{#if data.feature}
	<article class="mx-auto max-w-3xl space-y-6">
		<header class="space-y-4">
			<h1 class="text-4xl font-bold">{data.feature.title}</h1>
			<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				{#if data.feature.published_at}
					<span>{new Date(data.feature.published_at).toLocaleDateString()}</span>
				{/if}
			</div>
		</header>

		{#if data.feature.featured_image}
			<img
				src={data.feature.featured_image}
				alt={data.feature.title}
				class="w-full rounded-lg object-cover"
			/>
		{/if}

		{#if data.feature.feature_image}
			<img
				src={data.feature.feature_image}
				alt={data.feature.title}
				class="w-full rounded-lg object-cover"
			/>
		{/if}

		<div class="prose max-w-none">
			{@html data.feature.content || ''}
		</div>
	</article>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold">Feature not found</h1>
		<p class="text-muted-foreground">This feature may have been removed or moved.</p>
	</div>
{/if}
