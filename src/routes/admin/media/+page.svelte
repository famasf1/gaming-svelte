<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold">Media</h1>

	{#if data.files.length === 0}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">
			No images uploaded yet.
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#each data.files as file}
				<div class="group relative aspect-square overflow-hidden rounded-lg border">
					<img
						src={`https://xsrtibrlutbinmupmfcs.supabase.co/storage/v1/object/public/articles-img/uploads/${file.name}`}
						alt={file.name}
						class="h-full w-full object-cover"
					/>
					<div
						class="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div class="flex h-full items-center justify-center gap-2">
							<Button
								size="sm"
								variant="secondary"
								onclick={() =>
									navigator.clipboard.writeText(
										`https://xsrtibrlutbinmupmfcs.supabase.co/storage/v1/object/public/articles-img/uploads/${file.name}`
									)}
							>
								Copy URL
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
