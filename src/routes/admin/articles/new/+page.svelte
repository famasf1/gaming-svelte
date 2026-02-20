<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Editor, ImageUpload } from '$lib/components/editor';

	let { data } = $props();

	let title = $state('');
	let slug = $state('');
	let content = $state('');
	let excerpt = $state('');
	let featured_image = $state('');
	let is_published = $state(false);
	let selectedCategories = $state<number[]>([]);
	let selectedTags = $state<number[]>([]);

	let saving = $state(false);

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
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<form method="POST" onsubmit={handleSubmit} class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">New Article</h1>
			<Button type="submit" disabled={saving}>
				{saving ? 'Saving...' : 'Save'}
			</Button>
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
</div>
