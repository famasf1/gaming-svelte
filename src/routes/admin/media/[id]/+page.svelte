<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	const file = $derived(data.file);
	let name = $state('');
	let showTrashDialog = $state(false);

	$effect(() => {
		if (file) {
			name = file.name ?? '';
		}
	});
</script>

<div class="mx-auto max-w-2xl space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Edit Media</h1>
		<a href="/admin/media" class="text-sm text-muted-foreground hover:underline"> Back to Media </a>
	</div>

	{#if file}
		<div class="space-y-6">
			<div class="rounded-lg border p-4">
				<img src={file.url} alt={name} class="max-h-[400px] w-auto rounded-lg" />
			</div>

			<form method="POST" action="?/save" class="space-y-4">
				<div class="space-y-2">
					<Label for="name">Name</Label>
					<Input id="name" name="name" value={name} required />
				</div>

				<div class="space-y-2">
					<Label>URL</Label>
					<div class="flex gap-2">
						<Input value={file.url} readonly class="bg-muted" />
						<Button
							type="button"
							variant="secondary"
							onclick={() => navigator.clipboard.writeText(file.url)}
						>
							Copy
						</Button>
					</div>
				</div>

				<div class="space-y-2">
					<Label>Size</Label>
					<p class="text-sm text-muted-foreground">
						{Math.round((file.size ?? 0) / 1024)} KB
					</p>
				</div>

				<div class="space-y-2">
					<Label>Type</Label>
					<p class="text-sm text-muted-foreground">{file.mime_type}</p>
				</div>

				<div class="flex gap-2">
					<Button type="submit">Save</Button>
					<Button type="button" variant="destructive" onclick={() => (showTrashDialog = true)}>
						Delete
					</Button>
				</div>
			</form>
		</div>
	{:else}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">Media not found.</div>
	{/if}
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Delete Media"
	description="Are you sure you want to delete this media?"
	confirmText="Delete"
	variant="destructive"
	onConfirm={() => {
		showTrashDialog = false;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		document.body.appendChild(form);
		form.submit();
	}}
/>
