<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	async function handleRestore(id: number) {
		await fetch('/admin/media/trash?/restore', {
			method: 'POST',
			body: new URLSearchParams({ id: id.toString() })
		});
		window.location.reload();
	}

	async function handleDelete(id: number) {
		if (!confirm('Permanently delete this image? This cannot be undone.')) return;
		await fetch('/admin/media/trash?/delete', {
			method: 'POST',
			body: new URLSearchParams({ id: id.toString() })
		});
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Media Trash</h1>
		<a href="/admin/media" class="text-sm text-muted-foreground hover:underline"> Back to Media </a>
	</div>

	{#if data.files.length === 0}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">Trash is empty.</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#each data.files as file}
				<div class="group relative aspect-square overflow-hidden rounded-lg border opacity-75">
					<img src={file.url} alt={file.name} class="h-full w-full object-cover" />
					<div
						class="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="flex h-full flex-col items-center justify-center gap-2 p-2">
							<Button size="sm" onclick={() => handleRestore(file.id)}>Restore</Button>
							<Button size="sm" variant="destructive" onclick={() => handleDelete(file.id)}>
								Delete Forever
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
