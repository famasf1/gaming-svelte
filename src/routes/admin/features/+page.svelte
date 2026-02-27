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
		<h1 class="text-2xl font-bold">Features</h1>
		<Button href="/admin/features/new">New Feature</Button>
	</div>

	<div class="flex gap-2">
		<a
			href="/admin/features"
			class="rounded-lg px-3 py-1 {data.filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">All</a
		>
		<a
			href="/admin/features?filter=published"
			class="rounded-lg px-3 py-1 {data.filter === 'published'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">Published</a
		>
		<a
			href="/admin/features?filter=draft"
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
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.features && data.features.length > 0}
					{#each data.features as feature}
						<tr class="border-b">
							<td class="px-4 py-3">
								<a href="/admin/features/{feature.id}" class="font-medium hover:underline"
									>{feature.title}</a
								>
							</td>
							<td class="px-4 py-3">
								<span
									class:text-green-600={feature.is_published}
									class:text-muted-foreground={!feature.is_published}
								>
									{feature.is_published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a
										href="/admin/features/{feature.id}"
										class="text-sm text-primary hover:underline">Edit</a
									>
									<button
										class="text-sm text-destructive hover:underline"
										onclick={() => {
											deleteId = feature.id;
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
						<td colspan="3" class="px-4 py-8 text-center text-muted-foreground">
							No features yet. <a href="/admin/features/new" class="text-primary hover:underline"
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
	title="Delete Feature"
	description="Are you sure you want to delete this feature?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
