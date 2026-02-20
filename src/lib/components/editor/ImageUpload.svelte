<script lang="ts">
	import { supabaseBrowserClient } from '$lib/supabase';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Props {
		value?: string;
		onchange?: (url: string) => void;
		class?: string;
		bucket?: string;
	}

	let { value = '', onchange, class: className, bucket = 'articles-img' }: Props = $props();

	let uploading = $state(false);
	let inputRef: HTMLInputElement;

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		uploading = true;

		const fileExt = file.name.split('.').pop();
		const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
		const filePath = `uploads/${fileName}`;

		const { data, error } = await supabaseBrowserClient.storage.from(bucket).upload(filePath, file);

		if (error) {
			console.error('Upload error:', error);
			alert('Failed to upload image');
			uploading = false;
			return;
		}

		const { data: urlData } = supabaseBrowserClient.storage.from(bucket).getPublicUrl(filePath);

		if (urlData?.publicUrl) {
			onchange?.(urlData.publicUrl);
		}

		uploading = false;
		if (inputRef) inputRef.value = '';
	}

	function clearImage() {
		onchange?.('');
	}
</script>

<div class={cn('space-y-2', className)}>
	{#if value}
		<div class="relative aspect-video w-full overflow-hidden rounded-md border">
			<img src={value} alt="Featured" class="h-full w-full object-cover" />
			<Button
				type="button"
				variant="destructive"
				size="sm"
				class="absolute top-2 right-2"
				onclick={clearImage}
			>
				Remove
			</Button>
		</div>
	{/if}

	<input
		type="file"
		accept="image/*"
		class="hidden"
		bind:this={inputRef}
		onchange={handleFileSelect}
		disabled={uploading}
	/>

	<Button type="button" variant="outline" onclick={() => inputRef?.click()} disabled={uploading}>
		{uploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
	</Button>
</div>
