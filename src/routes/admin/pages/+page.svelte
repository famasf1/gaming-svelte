<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	const filter = $derived(page.url.searchParams.get('filter') || 'all');
	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);

	async function handleDelete() {
		if (!deleteId) return;
		const formData = new FormData();
		formData.append('id', deleteId.toString());

		await fetch('/admin/pages?/delete', {
			method: 'POST',
			body: formData
		});

		showTrashDialog = false;
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Pages</h1>
		<a
			href="/admin/pages/new"
			class="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
		>
			New Page
		</a>
	</div>

	<div class="flex gap-2">
		<a
			href="/admin/pages?filter=all"
			class="rounded-lg px-3 py-1 {filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			All
		</a>
		<a
			href="/admin/pages?filter=published"
			class="rounded-lg px-3 py-1 {filter === 'published'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Published
		</a>
		<a
			href="/admin/pages?filter=draft"
			class="rounded-lg px-3 py-1 {filter === 'draft'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Drafts
		</a>
	</div>

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Title</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Slug</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.pages && data.pages.length > 0}
					{#each data.pages as p}
						<tr class="border-b">
							<td class="px-4 py-3 font-medium">{p.title}</td>
							<td class="px-4 py-3 text-muted-foreground">/{p.slug}</td>
							<td class="px-4 py-3">
								<Badge variant={p.is_published ? 'default' : 'secondary'}>
									{p.is_published ? 'Published' : 'Draft'}
								</Badge>
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<a href="/admin/pages/{p.id}" class="text-sm text-primary hover:underline">Edit</a
									>
									<button
										class="text-sm text-destructive hover:underline"
										onclick={() => {
											deleteId = p.id;
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
						<td colspan="4" class="px-4 py-8 text-center text-muted-foreground">
							No pages found.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete Page"
	description="Are you sure you want to delete this page?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
