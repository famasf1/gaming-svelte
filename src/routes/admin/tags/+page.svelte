<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showForm = $state(false);
	let name = $state('');
	let showTrashDialog = $state(false);
	let deleteId = $state<number | null>(null);

	function openCreateForm() {
		showForm = true;
		name = '';
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		await fetch('/admin/tags?/create', {
			method: 'POST',
			body: formData
		});

		showForm = false;
		window.location.reload();
	}

	async function handleDelete() {
		if (!deleteId) return;
		const formData = new FormData();
		formData.append('id', deleteId.toString());

		await fetch('/admin/tags?/delete', {
			method: 'POST',
			body: formData
		});

		showTrashDialog = false;
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Tags</h1>
		<Button onclick={openCreateForm}>New Tag</Button>
	</div>

	{#if showForm}
		<form onsubmit={handleSubmit} class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">New Tag</h2>

			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input id="name" name="name" value={name} required />
			</div>

			<div class="flex gap-2">
				<Button type="submit">Save</Button>
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
				{#if data.tags && data.tags.length > 0}
					{#each data.tags as tag}
						<tr class="border-b">
							<td class="px-4 py-3 font-medium">{tag.name}</td>
							<td class="px-4 py-3 text-muted-foreground">{tag.slug}</td>
							<td class="px-4 py-3">
								<button
									class="text-sm text-destructive hover:underline"
									onclick={() => {
										deleteId = tag.id;
										showTrashDialog = true;
									}}
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="3" class="px-4 py-8 text-center text-muted-foreground"> No tags yet. </td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete Tag"
	description="Are you sure you want to delete this tag?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={handleDelete}
/>
