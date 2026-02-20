<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes {}

	let { class: className, ...props }: Props = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...props}>
	<slot />
</div>
