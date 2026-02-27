<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let submitting = $state(false);
	let formResult = $state<{ success?: boolean; message?: string } | null>(null);

	const articleUrl = $derived(typeof window !== 'undefined' ? window.location.href : '');
</script>

<svelte:head>
	<title>{data.review.meta_title || data.review.title} - Gaming News Blog</title>
	<meta name="description" content={data.review.meta_description || data.review.excerpt || ''} />

	<meta property="og:title" content={data.review.meta_title || data.review.title} />
	<meta
		property="og:description"
		content={data.review.meta_description || data.review.excerpt || ''}
	/>
	<meta property="og:image" content={data.review.meta_image || data.review.featured_image || ''} />
	<meta property="og:type" content="article" />

	<link rel="canonical" href={articleUrl} />
</svelte:head>

{#if data.review}
	<article class="mx-auto max-w-3xl space-y-6">
		<header class="space-y-4">
			<h1 class="text-4xl font-bold">{data.review.title}</h1>
			{#if data.review.game_title}
				<p class="text-xl text-muted-foreground">{data.review.game_title}</p>
			{/if}
			<div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
				{#if data.review.rating}
					<span class="flex items-center gap-1 text-lg font-semibold text-yellow-500">
						{data.review.rating}/10
					</span>
				{/if}
				{#if data.review.game_platform}
					<span>{data.review.game_platform}</span>
				{/if}
				{#if data.review.published_at}
					<span>{new Date(data.review.published_at).toLocaleDateString()}</span>
				{/if}
			</div>
		</header>

		{#if data.review.featured_image}
			<img
				src={data.review.featured_image}
				alt={data.review.title}
				class="w-full rounded-lg object-cover"
			/>
		{/if}

		<div class="prose max-w-none">
			{@html data.review.content || ''}
		</div>
	</article>
{:else}
	<div class="py-12 text-center">
		<h1 class="text-2xl font-bold">Review not found</h1>
		<p class="text-muted-foreground">This review may have been removed or moved.</p>
	</div>
{/if}
