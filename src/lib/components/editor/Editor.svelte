<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Props {
		content?: string;
		placeholder?: string;
		onchange?: (html: string) => void;
		class?: string;
	}

	let {
		content = '',
		placeholder = 'Start writing...',
		onchange,
		class: className
	}: Props = $props();

	let element: HTMLDivElement;
	let editor: Editor | undefined = $state();

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Image.configure({ inline: true }),
				Link.configure({ openOnClick: false }),
				Placeholder.configure({ placeholder })
			],
			content,
			onUpdate: ({ editor }) => {
				onchange?.(editor.getHTML());
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleHeading(level: 1 | 2 | 3) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function setLink() {
		const url = window.prompt('Enter URL:');
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	function addImage() {
		const url = window.prompt('Enter image URL:');
		if (url) {
			editor?.chain().focus().setImage({ src: url }).run();
		}
	}
</script>

<div class={cn('rounded-md border', className)}>
	<div class="flex flex-wrap gap-1 border-b p-2">
		<Button type="button" size="sm" variant="ghost" onclick={toggleBold}>
			<span class="font-bold">B</span>
		</Button>
		<Button type="button" size="sm" variant="ghost" onclick={toggleItalic}>
			<span class="italic">I</span>
		</Button>
		<Button type="button" size="sm" variant="ghost" onclick={() => toggleHeading(1)}>H1</Button>
		<Button type="button" size="sm" variant="ghost" onclick={() => toggleHeading(2)}>H2</Button>
		<Button type="button" size="sm" variant="ghost" onclick={() => toggleHeading(3)}>H3</Button>
		<Button type="button" size="sm" variant="ghost" onclick={toggleBulletList}>• List</Button>
		<Button type="button" size="sm" variant="ghost" onclick={toggleOrderedList}>1. List</Button>
		<Button type="button" size="sm" variant="ghost" onclick={setLink}>Link</Button>
		<Button type="button" size="sm" variant="ghost" onclick={addImage}>Image</Button>
	</div>
	<div
		bind:this={element}
		class="prose min-h-[300px] max-w-none p-4 prose-zinc dark:prose-invert"
	></div>
</div>
