<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {}

	let { class: className, checked = $bindable(false), ...props }: Props = $props();
</script>

<input
	type="checkbox"
	class={cn(
		'h-[20px] w-[36px] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
		className
	)}
	bind:checked
	{...props}
/>
