<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let dragging = $state(false);
	let uploading = $state(false);
	let fileInput: HTMLInputElement;

	async function handleUpload(file: File) {
		uploading = true;
		const formData = new FormData();
		formData.set('file', file);

		await fetch('/admin/media?/upload', {
			method: 'POST',
			body: formData
		});

		uploading = false;
		window.location.reload();
	}

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await handleUpload(file);
		}
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			await handleUpload(file);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}

	function handleDragLeave() {
		dragging = false;
	}

	async function handleDelete(id: number) {
		if (!confirm('Move this image to trash?')) return;
		await fetch('/admin/media?/delete', {
			method: 'POST',
			body: new URLSearchParams({ id: id.toString() })
		});
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Media</h1>
		<a href="/admin/media/trash" class="text-sm text-muted-foreground hover:underline">
			View Trash
		</a>
	</div>

	<div
		class={cn(
			'relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
			dragging ? 'border-primary bg-primary/5' : 'border-border',
			uploading && 'pointer-events-none opacity-50'
		)}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		onclick={() => fileInput?.click()}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
	>
		<input
			type="file"
			accept="image/*"
			class="hidden"
			bind:this={fileInput}
			onchange={handleFileSelect}
			disabled={uploading}
		/>
		<p class="text-center text-muted-foreground">
			{uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
		</p>
	</div>

	{#if data.files.length === 0}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">
			No images uploaded yet.
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#each data.files as file}
				<div class="group relative aspect-square overflow-hidden rounded-lg border">
					<img src={file.url} alt={file.name} class="h-full w-full object-cover" />
					<div
						class="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="flex h-full flex-col items-center justify-center gap-2 p-2">
							<Button
								size="sm"
								variant="secondary"
								onclick={() => navigator.clipboard.writeText(file.url)}
							>
								Copy URL
							</Button>
							<a href="/admin/media/{file.id}" class="w-full">
								<Button size="sm" variant="secondary" class="w-full">Edit</Button>
							</a>
							<Button size="sm" variant="destructive" onclick={() => handleDelete(file.id)}>
								Delete
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
