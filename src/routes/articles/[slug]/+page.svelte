<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let submitting = $state(false);
	let formResult = $state<{
		success?: boolean;
		needsModeration?: boolean;
		message?: string;
	} | null>(null);

	const articleUrl = $derived(typeof window !== 'undefined' ? window.location.href : '');
</script>

<svelte:head>
	<title>{data.article.meta_title || data.article.title} - Gaming News Blog</title>
	<meta name="description" content={data.article.meta_description || data.article.excerpt || ''} />

	<meta property="og:title" content={data.article.meta_title || data.article.title} />
	<meta
		property="og:description"
		content={data.article.meta_description || data.article.excerpt || ''}
	/>
	<meta
		property="og:image"
		content={data.article.meta_image || data.article.featured_image || ''}
	/>
	<meta property="og:type" content="article" />

	<link rel="canonical" href={articleUrl} />

	{@html `<script type="application/ld+json">
		${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: data.article.title,
			description: data.article.meta_description || data.article.excerpt,
			image: data.article.meta_image || data.article.featured_image,
			datePublished: data.article.published_at,
			dateModified: data.article.updated_at,
			author: { '@type': 'Person', name: 'Admin' }
		})}
	</script>`}
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

	{#if data.settings.allow_comments !== 'false'}
		<section class="mx-auto max-w-3xl space-y-6 pt-8">
			<h2 class="text-2xl font-bold">Comments ({data.comments.length})</h2>

			{#if data.comments.length > 0}
				<div class="space-y-4">
					{#each data.comments as comment}
						<div class="rounded-lg border p-4">
							<div class="flex items-center justify-between">
								<span class="font-medium">{comment.name}</span>
								<span class="text-sm text-muted-foreground">
									{new Date(comment.created_at).toLocaleDateString()}
								</span>
							</div>
							<p class="mt-2 text-muted-foreground">{comment.content}</p>
						</div>
					{/each}
				</div>
			{/if}

			<form
				method="POST"
				action="?/createComment"
				use:enhance={() => {
					submitting = true;
					return async ({ result }) => {
						submitting = false;
						if (result.type === 'success') {
							const data = result.data as { success: boolean; needsModeration: boolean };
							formResult = {
								success: true,
								needsModeration: data.needsModeration
							};
						} else if (result.type === 'failure') {
							const data = result.data as { message: string };
							formResult = { message: data.message };
						}
					};
				}}
				class="space-y-4 rounded-lg border p-4"
			>
				<h3 class="text-lg font-semibold">Leave a Comment</h3>

				{#if formResult?.success}
					<div class="rounded-lg bg-green-50 p-4 text-green-800">
						{#if formResult.needsModeration}
							Comment submitted! It will appear after moderation.
						{:else}
							Comment posted successfully!
						{/if}
					</div>
				{:else}
					{#if formResult?.message}
						<div class="rounded-lg bg-red-50 p-4 text-red-800">{formResult.message}</div>
					{/if}

					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<label for="name" class="text-sm font-medium">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								class="w-full rounded-md border px-3 py-2"
							/>
						</div>
						<div class="space-y-2">
							<label for="email" class="text-sm font-medium">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								class="w-full rounded-md border px-3 py-2"
							/>
						</div>
					</div>
					<div class="space-y-2">
						<label for="content" class="text-sm font-medium">Comment</label>
						<textarea
							id="content"
							name="content"
							required
							rows="4"
							class="w-full rounded-md border px-3 py-2"
						></textarea>
					</div>
					<button
						type="submit"
						disabled={submitting}
						class="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
					>
						{submitting ? 'Submitting...' : 'Submit Comment'}
					</button>
				{/if}
			</form>
		</section>
	{/if}
{:else}
	<div class="text-center">
		<h1 class="text-2xl font-bold">Article not found</h1>
		<a href="/" class="text-primary hover:underline">Back to home</a>
	</div>
{/if}
