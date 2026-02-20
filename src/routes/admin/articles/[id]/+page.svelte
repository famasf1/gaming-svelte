<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Editor, ImageUpload } from '$lib/components/editor';
	import TrashDialog from '$lib/components/ui/trash-dialog.svelte';

	let { data } = $props();

	let title = $derived(data.article?.title ?? '');
	let slug = $derived(data.article?.slug ?? '');
	let content = $derived(data.article?.content ?? '');
	let excerpt = $derived(data.article?.excerpt ?? '');
	let featured_image = $derived(data.article?.featured_image ?? '');
	let is_published = $derived(data.article?.is_published ?? false);
	let selectedCategories = $derived<number[]>(
		data.article?.article_categories?.map((c: any) => c.category_id) ?? []
	);
	let selectedTags = $derived<number[]>(data.article?.article_tags?.map((t: any) => t.tag_id) ?? []);

	let showTrashDialog = $derived(false);
	let saving = $derived(false);

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

	async function handleSubmit(e: Event) {
		e.preventDefault();
		saving = true;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.set('content', content);
		formData.set('featured_image', featured_image);
		formData.set('is_published', is_published ? 'on' : '');

		selectedCategories.forEach((id) => formData.append('categories', id.toString()));
		selectedTags.forEach((id) => formData.append('tags', id.toString()));

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				goto('/admin/articles');
			}
		} finally {
			saving = false;
		}
	}

	async function handleDelete() {
		const id = page.params.id;
		if (!id) return;

		await fetch(`/admin/articles/${id}?/delete`, { method: 'POST' });
		goto('/admin/articles');
	}

	const isEditing = $derived(!!data.article);
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<form method="POST" onsubmit={handleSubmit} class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">{isEditing ? 'Edit Article' : 'New Article'}</h1>
			<div class="flex gap-2">
				{#if isEditing}
					<Button
						type="button"
						variant="outline"
						onclick={() => window.open(`/admin/articles/${data.article.id}/preview`, '_blank')}
					>
						Preview
					</Button>
					<Button type="button" variant="destructive" onclick={() => (showTrashDialog = true)}>
						Move to Trash
					</Button>
				{/if}
				<Button type="submit" disabled={saving}>
					{saving ? 'Saving...' : 'Save'}
				</Button>
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
					placeholder="Article title"
					required
				/>
			</div>

			<div class="space-y-2">
				<Label for="slug">Slug</Label>
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">/articles/</span>
					<Input
						id="slug"
						name="slug"
						value={slug}
						oninput={(e) => (slug = (e.target as HTMLInputElement).value)}
						placeholder="article-slug"
						required
					/>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<Label for="excerpt">Excerpt</Label>
			<Textarea
				id="excerpt"
				name="excerpt"
				value={excerpt}
				oninput={(e) => (excerpt = (e.target as HTMLTextAreaElement).value)}
				placeholder="Brief description..."
				rows={3}
			/>
		</div>

		<div class="space-y-2">
			<Label>Featured Image</Label>
			<ImageUpload value={featured_image} onchange={(url) => (featured_image = url)} />
		</div>

		<div class="space-y-2">
			<Label>Content</Label>
			<Editor {content} onchange={(html) => (content = html)} />
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<Label>Categories</Label>
				<div class="flex flex-wrap gap-2">
					{#each data.categories as category}
						<label class="flex items-center gap-2 rounded-lg border px-3 py-2">
							<input
								type="checkbox"
								checked={selectedCategories.includes(category.id)}
								onchange={(e) => {
									const checked = (e.target as HTMLInputElement).checked;
									if (checked) {
										selectedCategories = [...selectedCategories, category.id];
									} else {
										selectedCategories = selectedCategories.filter((id) => id !== category.id);
									}
								}}
							/>
							{category.name}
						</label>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<Label>Tags</Label>
				<div class="flex flex-wrap gap-2">
					{#each data.tags as tag}
						<label class="flex items-center gap-2 rounded-lg border px-3 py-2">
							<input
								type="checkbox"
								checked={selectedTags.includes(tag.id)}
								onchange={(e) => {
									const checked = (e.target as HTMLInputElement).checked;
									if (checked) {
										selectedTags = [...selectedTags, tag.id];
									} else {
										selectedTags = selectedTags.filter((id) => id !== tag.id);
									}
								}}
							/>
							{tag.name}
						</label>
					{/each}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<Switch bind:checked={is_published} />
			<Label>Published</Label>
		</div>
	</form>

	<TrashDialog
		bind:open={showTrashDialog}
		title="Move to Trash"
		description="Are you sure you want to move this article to trash? You can restore it later."
		confirmText="Move to Trash"
		onConfirm={handleDelete}
	/>
</div>
