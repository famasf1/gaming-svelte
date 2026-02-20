<script lang="ts">
	import type { PageServerLoad } from './$types';
	import { error } from '@sveltejs/kit';

	export const load: PageServerLoad = async ({ params, locals }) => {
		const { data: article } = await locals.supabase
			.from('articles')
			.select('*')
			.eq('id', params.id)
			.single();

		if (!article) {
			throw error(404, 'Article not found');
		}

		return { article };
	};
</script>

<svelte:head>
	<title>{data.article.title} - Preview</title>
</svelte:head>

<article class="mx-auto max-w-3xl space-y-6 p-6">
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
