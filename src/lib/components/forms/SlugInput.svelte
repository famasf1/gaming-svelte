<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';

	interface Props {
		value?: string;
		onchange?: (slug: string) => void;
		class?: string;
	}

	let { value = '', onchange, class: className }: Props = $props();

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onchange?.(target.value);
	}

	export function autoGenerate(text: string): string {
		return generateSlug(text);
	}
</script>

<div class={cn('space-y-2', className)}>
	<Label>Slug</Label>
	<div class="flex items-center gap-2">
		<span class="text-sm text-muted-foreground">/articles/</span>
		<Input type="text" {value} oninput={handleInput} placeholder="my-article-slug" class="flex-1" />
	</div>
	<p class="text-xs text-muted-foreground">Tip: Leave empty to auto-generate from title</p>
</div>
