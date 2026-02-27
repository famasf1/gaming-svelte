<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showAddForm = $state(false);
	let editingId = $state<number | null>(null);
	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);

	let addSaving = $state(false);
	let editSaving = $state(false);

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function openEdit(newsItem: any) {
		editingId = newsItem.id;
		(document.getElementById(`edit-title-${newsItem.id}`) as HTMLInputElement).value =
			newsItem.title;
		(document.getElementById(`edit-slug-${newsItem.id}`) as HTMLInputElement).value = newsItem.slug;
		(document.getElementById(`edit-summary-${newsItem.id}`) as HTMLInputElement).value =
			newsItem.summary || '';
		(document.getElementById(`edit-source-${newsItem.id}`) as HTMLInputElement).value =
			newsItem.source_url || '';
		(document.getElementById(`edit-tags-${newsItem.id}`) as HTMLInputElement).value =
			JSON.stringify(newsItem.game_tags || []);
		(document.getElementById(`edit-published-${newsItem.id}`) as HTMLInputElement).checked =
			newsItem.is_published;
	}

	function closeEdit() {
		editingId = null;
	}

	function handleDelete() {
		showTrashDialog = false;
		document.getElementById('delete-form')?.requestSubmit();
	}

	function handleAddTitle(e: Event) {
		const target = e.target as HTMLInputElement;
		const slugInput = document.getElementById('add-slug') as HTMLInputElement;
		if (slugInput && !slugInput.value) {
			slugInput.value = generateSlug(target.value);
		}
	}

	function handleEditTitle(e: Event, id: number) {
		const target = e.target as HTMLInputElement;
		const slugInput = document.getElementById(`edit-slug-${id}`) as HTMLInputElement;
		if (slugInput && slugInput.value === generateSlug(slugInput.value)) {
			slugInput.value = generateSlug(target.value);
		}
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
		<h1 class="text-2xl font-bold">News</h1>
		<Button onclick={() => (showAddForm = !showAddForm)}>
			{showAddForm ? 'Cancel' : 'Add News'}
		</Button>
	</div>

	{#if showAddForm}
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				addSaving = true;
				return async ({ result }) => {
					addSaving = false;
					if (result.type === 'success') {
						showAddForm = false;
						window.location.reload();
					} else if (result.type === 'failure') {
						alert(result.data?.message || 'Failed to create');
					}
				};
			}}
			class="space-y-4 rounded-lg border p-4"
		>
			<h2 class="font-semibold">Add News Item</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="add-title">Title</Label>
					<Input id="add-title" name="title" oninput={handleAddTitle} required />
				</div>
				<div class="space-y-2">
					<Label for="add-slug">Slug</Label>
					<Input id="add-slug" name="slug" required />
				</div>
			</div>
			<div class="space-y-2">
				<Label for="add-summary">Summary (max 280 chars)</Label>
				<Textarea id="add-summary" name="summary" rows={2} maxlength={280} />
			</div>
			<div class="space-y-2">
				<Label for="add-source">Source URL</Label>
				<Input id="add-source" name="source_url" placeholder="https://..." />
			</div>
			<div class="space-y-2">
				<Label for="add-tags">Game Tags (JSON array)</Label>
				<Input id="add-tags" name="game_tags" />
			</div>
			<div class="flex items-center gap-2">
				<input type="checkbox" id="add-published" name="is_published" class="rounded" />
				<Label for="add-published">Published</Label>
			</div>
			<Button type="submit" disabled={addSaving}>{addSaving ? 'Saving...' : 'Add'}</Button>
		</form>
	{/if}

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Title</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Summary</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.news && data.news.length > 0}
					{#each data.news as item}
						{#if editingId === item.id}
							<tr class="border-b bg-muted/30">
								<td colspan="4" class="p-4">
									<form
										method="POST"
										action="?/update"
										use:enhance={() => {
											editSaving = true;
											return async ({ result }) => {
												editSaving = false;
												if (result.type === 'success') {
													closeEdit();
													window.location.reload();
												} else if (result.type === 'failure') {
													alert(result.data?.message || 'Failed to update');
												}
											};
										}}
										class="space-y-3"
									>
										<input type="hidden" name="id" value={item.id} />
										<div class="grid gap-3 md:grid-cols-2">
											<Input
												id="edit-title-{item.id}"
												name="title"
												oninput={(e) => handleEditTitle(e, item.id)}
												required
											/>
											<Input id="edit-slug-{item.id}" name="slug" required />
										</div>
										<Textarea id="edit-summary-{item.id}" name="summary" rows={2} maxlength={280} />
										<Input id="edit-source-{item.id}" name="source_url" placeholder="Source URL" />
										<Input id="edit-tags-{item.id}" name="game_tags" />
										<div class="flex items-center gap-2">
											<input
												type="checkbox"
												id="edit-published-{item.id}"
												name="is_published"
												class="rounded"
											/>
											<Label for="edit-published-{item.id}">Published</Label>
										</div>
										<div class="flex gap-2">
											<Button type="submit" size="sm" disabled={editSaving}
												>{editSaving ? 'Saving...' : 'Save'}</Button
											>
											<Button type="button" variant="outline" size="sm" onclick={closeEdit}
												>Cancel</Button
											>
										</div>
									</form>
								</td>
							</tr>
						{:else}
							<tr class="border-b">
								<td class="px-4 py-3 font-medium">{item.title}</td>
								<td class="max-w-xs truncate px-4 py-3 text-muted-foreground"
									>{item.summary ?? '-'}</td
								>
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
										<button
											class="text-sm text-primary hover:underline"
											onclick={() => openEdit(item)}>Edit</button
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
						{/if}
					{/each}
				{:else}
					<tr>
						<td colspan="4" class="px-4 py-8 text-center text-muted-foreground">
							No news items yet. Click "Add News" to create one.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete News"
	description="Are you sure you want to delete this news item?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
