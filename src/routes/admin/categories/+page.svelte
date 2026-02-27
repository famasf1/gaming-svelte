<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showForm = $state(false);
	let editingId = $state<number | null>(null);
	let name = $state('');
	let description = $state('');
	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);
	let formLoading = $state(false);
	let deleteLoading = $state(false);

	function openCreateForm() {
		showForm = true;
		editingId = null;
		name = '';
		description = '';
	}

	function openEditForm(category: any) {
		showForm = true;
		editingId = category.id;
		name = category.name;
		description = category.description || '';
	}

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
			deleteLoading = true;
			return async ({ result }) => {
				deleteLoading = false;
				if (result.type === 'success') {
					window.location.reload();
				} else if (result.type === 'failure') {
					alert(result.data?.message || 'Failed to delete category');
				}
			};
		}}
	>
		<input type="hidden" name="id" value={deleteId ?? ''} />
	</form>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Categories</h1>
		<Button onclick={openCreateForm}>New Category</Button>
	</div>

	{#if showForm}
		<form
			method="POST"
			action="?/{editingId ? 'update' : 'create'}"
			use:enhance={() => {
				formLoading = true;
				return async ({ result }) => {
					formLoading = false;
					if (result.type === 'success') {
						showForm = false;
						window.location.reload();
					} else if (result.type === 'failure') {
						alert(result.data?.message || 'Failed to save category');
					}
				};
			}}
			class="space-y-4 rounded-lg border p-4"
		>
			<h2 class="text-lg font-semibold">{editingId ? 'Edit Category' : 'New Category'}</h2>

			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input id="name" name="name" value={name} required />
			</div>

			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea id="description" name="description" value={description} rows={3} />
			</div>

			{#if editingId}
				<input type="hidden" name="id" value={editingId} />
			{/if}

			<div class="flex gap-2">
				<Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save'}</Button>
				<Button type="button" variant="outline" onclick={() => (showForm = false)}>Cancel</Button>
			</div>
		</form>
	{/if}

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Name</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Slug</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.categories && data.categories.length > 0}
					{#each data.categories as category}
						<tr class="border-b">
							<td class="px-4 py-3 font-medium">{category.name}</td>
							<td class="px-4 py-3 text-muted-foreground">{category.slug}</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									<button
										class="text-sm text-primary hover:underline"
										onclick={() => openEditForm(category)}
									>
										Edit
									</button>
									<button
										class="text-sm text-destructive hover:underline"
										onclick={() => {
											deleteId = category.id;
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
							No categories yet.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete Category"
	description="Are you sure you want to delete this category?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
