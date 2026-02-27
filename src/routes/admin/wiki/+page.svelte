<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);

	const categories = ['tips', 'guides', 'achievements', 'lore', 'other'];

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
		<h1 class="text-2xl font-bold">Wiki</h1>
		<Button href="/admin/wiki/new">New Wiki Entry</Button>
	</div>

	<div class="flex gap-2">
		<a
			href="/admin/wiki"
			class="rounded-lg px-3 py-1 {data.filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">All</a
		>
		<a
			href="/admin/wiki?filter=published"
			class="rounded-lg px-3 py-1 {data.filter === 'published'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}">Published</a
		>
		<a
			href="/admin/wiki?filter=draft"
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
					<th class="px-4 py-3 text-left text-sm font-medium">Category</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.wiki && data.wiki.length > 0}
					{#each data.wiki as item}
						<tr class="border-b">
							<td class="px-4 py-3">
								<a href="/admin/wiki/{item.id}" class="font-medium hover:underline">{item.title}</a>
							</td>
							<td class="px-4 py-3 text-muted-foreground">{item.game_title ?? '-'}</td>
							<td class="px-4 py-3">
								<span class="rounded-full bg-muted px-2 py-1 text-xs capitalize"
									>{item.category ?? '-'}</span
								>
							</td>
							<td class="px-4 py-3">
								<span
									class:text-green-600={item.is_published}
									class:text-muted-foreground={!item.is_published}
								>
									{item.is_published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a href="/admin/wiki/{item.id}" class="text-sm text-primary hover:underline"
										>Edit</a
									>
									<button
										class="text-sm text-destructive hover:underline"
										onclick={() => {
											deleteId = item.id;
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
							No wiki entries yet. <a href="/admin/wiki/new" class="text-primary hover:underline"
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
	title="Delete Wiki Entry"
	description="Are you sure you want to delete this wiki entry?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
