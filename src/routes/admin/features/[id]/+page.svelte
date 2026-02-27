<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Editor, ImageUpload } from '$lib/components/editor';

	let { data } = $props();

	let title = $state(data.feature?.title ?? '');
	let slug = $state(data.feature?.slug ?? '');
	let content = $state(data.feature?.content ?? '');
	let excerpt = $state(data.feature?.excerpt ?? '');
	let featured_image = $state(data.feature?.featured_image ?? '');
	let feature_image = $state(data.feature?.feature_image ?? '');
	let is_published = $state(data.feature?.is_published ?? false);
	let published_at = $state(data.feature?.published_at ?? '');
	let meta_title = $state(data.feature?.meta_title ?? '');
	let meta_description = $state(data.feature?.meta_description ?? '');
	let meta_image = $state(data.feature?.meta_image ?? '');

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
		formData.set('feature_image', feature_image);
		formData.set('is_published', is_published ? 'on' : '');
		if (data.feature?.id) {
			formData.set('id', data.feature.id.toString());
		}

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				goto('/admin/features');
			} else {
				const result = await response.json();
				alert(result.message || 'Failed to save');
			}
		} catch (err) {
			alert('Failed to save');
		} finally {
			saving = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">{data.feature ? 'Edit Feature' : 'New Feature'}</h1>
		<div class="flex gap-2">
			<Button href="/admin/features">Cancel</Button>
			<Button type="submit" form="feature-form" disabled={saving}>
				{saving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</div>

	<form id="feature-form" method="POST" action="?/save" onsubmit={handleSubmit} class="space-y-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="title">Title</Label>
					<Input
						id="title"
						name="title"
						value={title}
						oninput={handleTitleInput}
						placeholder="Feature title"
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={slug} placeholder="feature-slug" required />
				</div>

				<div class="flex items-center gap-2">
					<Switch id="is_published" bind:checked={is_published} />
					<Label for="is_published">Published</Label>
				</div>

				{#if is_published}
					<div class="space-y-2">
						<Label for="published_at">Published Date</Label>
						<Input
							id="published_at"
							name="published_at"
							type="datetime-local"
							value={published_at ? new Date(published_at).toISOString().slice(0, 16) : ''}
						/>
					</div>
				{/if}
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="featured_image">Featured Image</Label>
					<ImageUpload bind:value={featured_image} />
				</div>

				<div class="space-y-2">
					<Label for="feature_image">Feature Image (analysis image)</Label>
					<ImageUpload bind:value={feature_image} />
				</div>

				<div class="space-y-2">
					<Label for="excerpt">Excerpt</Label>
					<Textarea
						id="excerpt"
						name="excerpt"
						value={excerpt}
						placeholder="Short description for listings"
						rows={3}
					/>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<Label>Content</Label>
			<Editor bind:content />
		</div>

		<div class="space-y-4 rounded-lg border p-4">
			<h3 class="font-semibold">SEO Settings</h3>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="meta_title">Meta Title</Label>
					<Input id="meta_title" name="meta_title" value={meta_title} />
				</div>
				<div class="space-y-2">
					<Label for="meta_description">Meta Description</Label>
					<Textarea
						id="meta_description"
						name="meta_description"
						value={meta_description}
						rows={2}
					/>
				</div>
				<div class="space-y-2">
					<Label for="meta_image">Meta Image</Label>
					<Input id="meta_image" name="meta_image" value={meta_image} placeholder="OG Image URL" />
				</div>
			</div>
		</div>
	</form>
</div>
