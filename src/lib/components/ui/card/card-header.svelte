<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes {}

	let { class: className, ...props }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
	<slot />
</div>
