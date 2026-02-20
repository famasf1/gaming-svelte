<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let showRestoreDialog = $state(false);
	let showPurgeDialog = $state(false);
	let actionType = $state<'restore' | 'purge'>('restore');
	let itemType = $state('');
	let itemId = $state<number | null>(null);
	let itemTitle = $state('');

	function openRestore(type: string, id: number, title: string) {
		actionType = 'restore';
		itemType = type;
		itemId = id;
		itemTitle = title;
		showRestoreDialog = true;
	}

	function openPurge(type: string, id: number, title: string) {
		actionType = 'purge';
		itemType = type;
		itemId = id;
		itemTitle = title;
		showPurgeDialog = true;
	}

	async function handleRestore() {
		if (!itemId || !itemType) return;
		const formData = new FormData();
		formData.append('type', itemType);
		formData.append('id', itemId.toString());

		await fetch('/admin/trash?/restore', { method: 'POST', body: formData });
		showRestoreDialog = false;
		window.location.reload();
	}

	async function handlePurge() {
		if (!itemId || !itemType) return;
		const formData = new FormData();
		formData.append('type', itemType);
		formData.append('id', itemId.toString());

		await fetch('/admin/trash?/purge', { method: 'POST', body: formData });
		showPurgeDialog = false;
		window.location.reload();
	}

	const hasItems = $derived(
		data.articles.length > 0 ||
			data.pages.length > 0 ||
			data.categories.length > 0 ||
			data.tags.length > 0
	);
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold">Trash</h1>

	{#if !hasItems}
		<div class="rounded-lg border p-8 text-center text-muted-foreground">Trash is empty.</div>
	{:else}
		{#if data.articles.length > 0}
			<div class="rounded-lg border">
				<h2 class="border-b bg-muted/50 px-4 py-2 font-semibold">
					Articles ({data.articles.length})
				</h2>
				{#each data.articles as article}
					<div class="flex items-center justify-between border-b px-4 py-2">
						<span>{article.title}</span>
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onclick={() => openRestore('articles', article.id, article.title)}
							>
								Restore
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onclick={() => openPurge('articles', article.id, article.title)}
							>
								Delete Permanently
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.pages.length > 0}
			<div class="rounded-lg border">
				<h2 class="border-b bg-muted/50 px-4 py-2 font-semibold">Pages ({data.pages.length})</h2>
				{#each data.pages as page}
					<div class="flex items-center justify-between border-b px-4 py-2">
						<span>{page.title}</span>
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onclick={() => openRestore('pages', page.id, page.title)}
							>
								Restore
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onclick={() => openPurge('pages', page.id, page.title)}
							>
								Delete Permanently
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.categories.length > 0}
			<div class="rounded-lg border">
				<h2 class="border-b bg-muted/50 px-4 py-2 font-semibold">
					Categories ({data.categories.length})
				</h2>
				{#each data.categories as category}
					<div class="flex items-center justify-between border-b px-4 py-2">
						<span>{category.name}</span>
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onclick={() => openRestore('categories', category.id, category.name)}
							>
								Restore
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onclick={() => openPurge('categories', category.id, category.name)}
							>
								Delete Permanently
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.tags.length > 0}
			<div class="rounded-lg border">
				<h2 class="border-b bg-muted/50 px-4 py-2 font-semibold">Tags ({data.tags.length})</h2>
				{#each data.tags as tag}
					<div class="flex items-center justify-between border-b px-4 py-2">
						<span>{tag.name}</span>
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onclick={() => openRestore('tags', tag.id, tag.name)}
							>
								Restore
							</Button>
							<Button
								size="sm"
								variant="destructive"
								onclick={() => openPurge('tags', tag.id, tag.name)}
							>
								Delete Permanently
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<TrashDialog
	bind:open={showRestoreDialog}
	title="Restore {itemType}"
	description="Restore '{itemTitle}' from trash?"
	confirmText="Restore"
	onConfirm={handleRestore}
/>

<TrashDialog
	bind:open={showPurgeDialog}
	title="Permanently Delete {itemType}"
	description="This will permanently delete '{itemTitle}'. This action cannot be undone."
	confirmText="Delete Permanently"
	variant="destructive"
	onConfirm={handlePurge}
/>
