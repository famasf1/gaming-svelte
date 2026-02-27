<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);

	function handleDelete() {
		showTrashDialog = false;
		document.getElementById('delete-form')?.requestSubmit();
	}
</script>

<div class="space-y-6">
	<form
		id="delete-form"
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					window.location.reload();
				}
			};
		}}
	>
		<input type="hidden" name="id" value={deleteId ?? ''} />
	</form>

	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Reviews</h1>
		<Button href="/admin/reviews/new">New Review</Button>
	</div>

	<div class="flex gap-2">
		<a
			href="/admin/reviews"
			class="rounded-lg px-3 py-1 {data.filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">All</a
		>
		<a
			href="/admin/reviews?filter=published"
			class="rounded-lg px-3 py-1 {data.filter === 'published'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">Published</a
		>
		<a
			href="/admin/reviews?filter=draft"
			class="rounded-lg px-3 py-1 {data.filter === 'draft'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">Drafts</a
		>
	</div>

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Title</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Game</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Rating</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.reviews && data.reviews.length > 0}
					{#each data.reviews as review}
						<tr class="border-b">
							<td class="px-4 py-3">
								<a href="/admin/reviews/{review.id}" class="font-medium hover:underline"
									>{review.title}</a
								>
							</td>
							<td class="px-4 py-3 text-muted-foreground">{review.game_title ?? '-'}</td>
							<td class="px-4 py-3">
								{#if review.rating}
									<span class="font-medium">{review.rating}/10</span>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								<span
									class:text-green-600={review.is_published}
									class:text-muted-foreground={!review.is_published}
								>
									{review.is_published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a href="/admin/reviews/{review.id}" class="text-sm text-primary hover:underline"
										>Edit</a
									>
									<button
										class="text-sm text-destructive hover:underline"
										onclick={() => {
											deleteId = review.id;
											showTrashDialog = true;
										}}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
							No reviews yet. <a href="/admin/reviews/new" class="text-primary hover:underline"
								>Create one</a
							>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete Review"
	description="Are you sure you want to delete this review?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
