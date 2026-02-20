<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onConfirm?: () => void;
		title?: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		variant?: 'default' | 'destructive';
	}

	let {
		open = $bindable(false),
		onOpenChange,
		onConfirm,
		title = 'Are you sure?',
		description = 'This action cannot be undone.',
		confirmText = 'Move to Trash',
		cancelText = 'Cancel',
		variant = 'default'
	}: Props = $props();

	function handleConfirm() {
		onConfirm?.();
		open = false;
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
	>
		<div class="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 shadow-lg">
			<h2 class="text-lg font-semibold">{title}</h2>
			<p class="text-sm text-muted-foreground">{description}</p>
			<div class="flex justify-end gap-2">
				<Button variant="outline" onclick={() => (open = false)}>
					{cancelText}
				</Button>
				<Button
					variant={variant === 'destructive' ? 'destructive' : 'default'}
					onclick={handleConfirm}
				>
					{confirmText}
				</Button>
			</div>
		</div>
	</div>
{/if}
