<script lang="ts">
	import {
		FileText,
		File,
		Folder,
		Tags,
		MessageCircle,
		Newspaper,
		BookOpen,
		Star
	} from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold">Dashboard</h1>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-2">
				<Star class="h-4 w-4 text-yellow-500" />
				<div class="text-sm text-muted-foreground">Reviews</div>
			</div>
			<div class="text-2xl font-bold">{data.stats.reviews}</div>
			<a href="/admin/reviews" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-2">
				<FileText class="h-4 w-4 text-blue-500" />
				<div class="text-sm text-muted-foreground">Features</div>
			</div>
			<div class="text-2xl font-bold">{data.stats.features}</div>
			<a href="/admin/features" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-2">
				<Newspaper class="h-4 w-4 text-green-500" />
				<div class="text-sm text-muted-foreground">News</div>
			</div>
			<div class="text-2xl font-bold">{data.stats.news}</div>
			<a href="/admin/news" class="text-sm text-primary hover:underline">Manage</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center gap-2">
				<BookOpen class="h-4 w-4 text-purple-500" />
				<div class="text-sm text-muted-foreground">Wiki</div>
			</div>
			<div class="text-2xl font-bold">{data.stats.wiki}</div>
			<a href="/admin/wiki" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between">
				<div class="text-sm text-muted-foreground">Categories</div>
				<Folder class="h-4 w-4 text-muted-foreground" />
			</div>
			<div class="text-2xl font-bold">{data.stats.categories}</div>
			<a href="/admin/categories" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between">
				<div class="text-sm text-muted-foreground">Tags</div>
				<Tags class="h-4 w-4 text-muted-foreground" />
			</div>
			<div class="text-2xl font-bold">{data.stats.tags}</div>
			<a href="/admin/tags" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between">
				<div class="text-sm text-muted-foreground">Pages</div>
				<File class="h-4 w-4 text-muted-foreground" />
			</div>
			<div class="text-2xl font-bold">{data.stats.pages}</div>
			<a href="/admin/pages" class="text-sm text-primary hover:underline">View All</a>
		</div>
		<a
			href="/admin/comments?filter=pending"
			class="rounded-lg border bg-card p-4 hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm text-muted-foreground">Pending Comments</div>
				<MessageCircle class="h-5 w-5 text-muted-foreground" />
			</div>
			<div class="text-2xl font-bold">{data.stats.pendingComments}</div>
		</a>
	</div>

	<div class="flex flex-wrap gap-3">
		<a
			href="/admin/reviews/new"
			class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
		>
			<Star class="h-4 w-4" />
			New Review
		</a>
		<a
			href="/admin/features/new"
			class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			<FileText class="h-4 w-4" />
			New Feature
		</a>
		<a
			href="/admin/news"
			class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
		>
			<Newspaper class="h-4 w-4" />
			Manage News
		</a>
		<a
			href="/admin/wiki/new"
			class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
		>
			<BookOpen class="h-4 w-4" />
			New Wiki
		</a>
		<a
			href="/admin/pages/new"
			class="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
		>
			<File class="h-4 w-4" />
			New Page
		</a>
		<a
			href="/admin/categories"
			class="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
		>
			<Folder class="h-4 w-4" />
			New Category
		</a>
		<a
			href="/admin/tags"
			class="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
		>
			<Tags class="h-4 w-4" />
			New Tag
		</a>
	</div>

	{#if data.stats.trash > 0}
		<a
			href="/admin/trash"
			class="block rounded-lg border border-dashed p-4 text-center text-muted-foreground hover:bg-muted"
		>
			{data.stats.trash} item{data.stats.trash > 1 ? 's' : ''} in Trash
		</a>
	{/if}

	<div class="grid gap-6 lg:grid-cols-2">
		<div class="rounded-lg border">
			<div class="border-b bg-muted/50 px-4 py-3">
				<h2 class="font-semibold">Recent Reviews</h2>
			</div>
			{#if data.recentReviews.length > 0}
				<div class="divide-y">
					{#each data.recentReviews as review}
						<a
							href="/admin/reviews/{review.id}"
							class="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
						>
							<div>
								<div class="font-medium">{review.title}</div>
								<div class="text-sm text-muted-foreground">
									{review.game_title ?? 'No game'}{review.rating ? ` • ${review.rating}/10` : ''}
								</div>
							</div>
							<span class="text-sm text-muted-foreground">
								{review.published_at ? new Date(review.published_at).toLocaleDateString() : '-'}
							</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="px-4 py-8 text-center text-muted-foreground">
					No reviews yet. <a href="/admin/reviews/new" class="text-primary hover:underline"
						>Create one</a
					>
				</div>
			{/if}
		</div>

		<div class="rounded-lg border">
			<div class="border-b bg-muted/50 px-4 py-3">
				<h2 class="font-semibold">Recent Features</h2>
			</div>
			{#if data.recentFeatures.length > 0}
				<div class="divide-y">
					{#each data.recentFeatures as feature}
						<a
							href="/admin/features/{feature.id}"
							class="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
						>
							<div>
								<div class="font-medium">{feature.title}</div>
								<div class="text-sm text-muted-foreground">
									{feature.is_published ? 'Published' : 'Draft'}
								</div>
							</div>
							<span class="text-sm text-muted-foreground">
								{feature.published_at ? new Date(feature.published_at).toLocaleDateString() : '-'}
							</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="px-4 py-8 text-center text-muted-foreground">
					No features yet. <a href="/admin/features/new" class="text-primary hover:underline"
						>Create one</a
					>
				</div>
			{/if}
		</div>
	</div>
</div>
