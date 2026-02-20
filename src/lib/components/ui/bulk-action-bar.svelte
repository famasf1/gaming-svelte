<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		selectedCount?: number;
		class?: string;
	}

	let { selectedCount = 0, class: className }: Props = $props();

	let visible = $derived(selectedCount > 0);
</script>

{#if visible}
	<div
		class="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-lg border bg-card px-6 py-3 shadow-lg"
	>
		<span class="text-sm">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</span>
		<div class="flex gap-2">
			<Button size="sm" variant="outline" onclick={() => console.log('Bulk publish')}>
				Publish
			</Button>
			<Button size="sm" variant="outline" onclick={() => console.log('Bulk unpublish')}>
				Unpublish
			</Button>
			<Button size="sm" variant="destructive" onclick={() => console.log('Bulk delete')}>
				Delete
			</Button>
		</div>
	</div>
{/if}
