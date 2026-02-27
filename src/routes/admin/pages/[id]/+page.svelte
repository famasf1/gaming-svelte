<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	const isEditing = $derived(!!data.page);

	let title = $state('');
	let slug = $state('');
	let content = $state('');
	let meta_title = $state('');
	let meta_description = $state('');
	let meta_image = $state('');

	$effect(() => {
		if (data.page) {
			title = data.page.title ?? '';
			slug = data.page.slug ?? '';
			content = data.page.content ?? '';
			meta_title = data.page.meta_title ?? '';
			meta_description = data.page.meta_description ?? '';
			meta_image = data.page.meta_image ?? '';
		}
	});

	let showTrashDialog = $state(false);

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function handleTitleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		title = target.value;
		if (!slug || slug === generateSlug(slug)) {
			slug = generateSlug(title);
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<form method="POST" action="?/save" class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">{isEditing ? 'Edit Page' : 'New Page'}</h1>
			<div class="flex gap-2">
				{#if isEditing}
					<Button type="button" variant="destructive" onclick={() => (showTrashDialog = true)}>
						Move to Trash
					</Button>
				{/if}
				<Button type="submit">Save</Button>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<Label for="title">Title</Label>
				<Input
					id="title"
					name="title"
					value={title}
					oninput={handleTitleInput}
					placeholder="Page title"
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="slug">Slug</Label>
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">/</span>
					<Input
						id="slug"
						name="slug"
						value={slug}
						oninput={(e) => (slug = (e.target as HTMLInputElement).value)}
						placeholder="page-slug"
						required
					/>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<Label for="content">Content</Label>
			<Textarea
				id="content"
				name="content"
				value={content}
				oninput={(e) => (content = (e.target as HTMLTextAreaElement).value)}
				placeholder="Page content"
				rows={15}
				required
			/>
		</div>

		<div class="space-y-4 rounded-lg border p-4">
			<h3 class="text-lg font-semibold">SEO Settings</h3>

			<div class="space-y-2">
				<Label for="meta_title">Meta Title</Label>
				<Input
					id="meta_title"
					name="meta_title"
					value={meta_title}
					oninput={(e) => (meta_title = (e.target as HTMLInputElement).value)}
					placeholder={title || 'Page title'}
				/>
			</div>

			<div class="space-y-2">
				<Label for="meta_description">Meta Description</Label>
				<Textarea
					id="meta_description"
					name="meta_description"
					value={meta_description}
					oninput={(e) => (meta_description = (e.target as HTMLTextAreaElement).value)}
					placeholder="Page description"
					rows={2}
				/>
			</div>

			<div class="space-y-2">
				<Label for="meta_image">Meta Image URL</Label>
				<Input
					id="meta_image"
					name="meta_image"
					value={meta_image}
					oninput={(e) => (meta_image = (e.target as HTMLInputElement).value)}
					placeholder="https://example.com/image.jpg"
				/>
			</div>
		</div>
	</form>
</div>

<TrashDialog
	bind:open={showTrashDialog}
	title="Move Page to Trash"
	description="Are you sure you want to move this page to trash?"
	confirmText="Move to Trash"
	variant="destructive"
	onConfirm={() => {
		showTrashDialog = false;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = `?/delete`;
		document.body.appendChild(form);
		form.submit();
	}}
/>
