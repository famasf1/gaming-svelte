<script lang="ts">
	import { enhance } from '$app/forms';
	import { Star, FileText, Newspaper, Bell } from 'lucide-svelte';

	let { data } = $props();

	let subscribing = $state(false);
	let subscribeEmail = $state('');
	let subscribeResult = $state<{ success?: boolean; message?: string } | null>(null);
</script>

<svelte:head>
	<title>Gaming News Blog</title>
</svelte:head>

<div class="space-y-12">
	{#if data.news && data.news.length > 0}
		<section class="rounded-xl bg-gradient-to-r from-green-900 to-green-700 p-6 text-white">
			<div class="mb-4 flex items-center gap-2">
				<Newspaper class="h-6 w-6" />
				<h2 class="text-2xl font-bold">Live News</h2>
			</div>
			<div class="flex gap-4 overflow-x-auto pb-2">
				{#each data.news as item}
					<div class="min-w-[280px] shrink-0 rounded-lg bg-white/10 p-4">
						<h3 class="mb-2 line-clamp-2 font-semibold">{item.title}</h3>
						{#if item.summary}
							<p class="mb-2 line-clamp-2 text-sm text-white/80">{item.summary}</p>
						{/if}
						<div class="flex items-center justify-between text-xs text-white/60">
							<span
								>{item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}</span
							>
							{#if item.source_url}
								<a
									href={item.source_url}
									target="_blank"
									rel="noopener"
									class="text-white/80 hover:underline">Source</a
								>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-4 rounded-lg bg-white/10 p-4">
				<div class="flex items-center gap-2">
					<Bell class="h-4 w-4" />
					<span class="text-sm font-medium">Get notified about your favorite games</span>
				</div>
				<form
					method="POST"
					action="?/subscribe"
					use:enhance={() => {
						subscribing = true;
						return async ({ result }) => {
							subscribing = false;
							if (result.type === 'success') {
								subscribeResult = { success: true, message: 'Subscribed!' };
								subscribeEmail = '';
							} else if (result.type === 'failure') {
								subscribeResult = { message: result.data?.message || 'Failed' };
							}
						};
					}}
					class="mt-2 flex gap-2"
				>
					<input
						type="email"
						name="email"
						bind:value={subscribeEmail}
						placeholder="Your email"
						class="flex-1 rounded px-3 py-2 text-black"
						required
					/>
					<button
						type="submit"
						disabled={subscribing}
						class="rounded bg-white px-4 py-2 font-medium text-green-700 hover:bg-white/90 disabled:opacity-50"
					>
						{subscribing ? '...' : 'Subscribe'}
					</button>
				</form>
				{#if subscribeResult}
					<p class="mt-2 text-sm {subscribeResult.success ? 'text-green-300' : 'text-red-300'}">
						{subscribeResult.message}
					</p>
				{/if}
			</div>
		</section>
	{/if}

	{#if data.reviews && data.reviews.length > 0}
		<section>
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Star class="h-6 w-6 text-yellow-500" />
					<h2 class="text-2xl font-bold">Reviews</h2>
				</div>
				<a href="/reviews" class="text-sm text-primary hover:underline">View All</a>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.reviews as review}
					<a
						href="/reviews/{review.slug}"
						class="group rounded-lg border bg-card transition-colors hover:border-primary"
					>
						{#if review.featured_image}
							<img
								src={review.featured_image}
								alt={review.title}
								class="aspect-video w-full rounded-t-lg object-cover"
							/>
						{:else}
							<div class="aspect-video w-full rounded-t-lg bg-muted"></div>
						{/if}
						<div class="p-4">
							<div class="mb-2 flex items-center justify-between">
								<h3 class="font-semibold group-hover:text-primary">{review.title}</h3>
								{#if review.rating}
									<span class="rounded-full bg-yellow-500 px-2 py-0.5 text-sm font-bold text-white">
										{review.rating}
									</span>
								{/if}
							</div>
							{#if review.game_title}
								<p class="mb-2 text-sm text-muted-foreground">{review.game_title}</p>
							{/if}
							{#if review.excerpt}
								<p class="line-clamp-2 text-sm text-muted-foreground">{review.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.features && data.features.length > 0}
		<section>
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<FileText class="h-6 w-6 text-blue-500" />
					<h2 class="text-2xl font-bold">Features</h2>
				</div>
				<a href="/features" class="text-sm text-primary hover:underline">View All</a>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				{#each data.features as feature}
					<a
						href="/features/{feature.slug}"
						class="group flex gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
					>
						{#if feature.featured_image || feature.feature_image}
							<img
								src={feature.feature_image || feature.featured_image}
								alt={feature.title}
								class="h-32 w-32 shrink-0 rounded-lg object-cover"
							/>
						{:else}
							<div class="h-32 w-32 shrink-0 rounded-lg bg-muted"></div>
						{/if}
						<div>
							<h3 class="mb-2 font-semibold group-hover:text-primary">{feature.title}</h3>
							{#if feature.excerpt}
								<p class="line-clamp-3 text-sm text-muted-foreground">{feature.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if (!data.news || data.news.length === 0) && (!data.reviews || data.reviews.length === 0) && (!data.features || data.features.length === 0)}
		<section>
			<div class="rounded-lg border bg-muted/50 p-12 text-center">
				<p class="text-muted-foreground">No content published yet. Check back soon!</p>
			</div>
		</section>
	{/if}
</div>
