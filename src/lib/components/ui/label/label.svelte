<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	interface Props extends HTMLLabelAttributes {
		children: any;
	}

	let { class: className,children, ...props }: Props = $props();
</script>

<label
	class={cn(
		'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...props}
>
	{@render children?.()}
</label>
