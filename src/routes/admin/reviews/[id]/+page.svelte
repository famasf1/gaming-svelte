<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Editor, ImageUpload } from '$lib/components/editor';

	let { data } = $props();

	let title = $state(data.review?.title ?? '');
	let slug = $state(data.review?.slug ?? '');
	let content = $state(data.review?.content ?? '');
	let excerpt = $state(data.review?.excerpt ?? '');
	let featured_image = $state(data.review?.featured_image ?? '');
	let rating = $state(data.review?.rating ?? 5);
	let game_title = $state(data.review?.game_title ?? '');
	let game_platform = $state(data.review?.game_platform ?? '');
	let is_published = $state(data.review?.is_published ?? false);
	let published_at = $state(data.review?.published_at ?? '');
	let meta_title = $state(data.review?.meta_title ?? '');
	let meta_description = $state(data.review?.meta_description ?? '');
	let meta_image = $state(data.review?.meta_image ?? '');

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
		if (data.review?.id) {
			formData.set('id', data.review.id.toString());
		}

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				goto('/admin/reviews');
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
		<h1 class="text-2xl font-bold">{data.review ? 'Edit Review' : 'New Review'}</h1>
		<div class="flex gap-2">
			<Button href="/admin/reviews">Cancel</Button>
			<Button type="submit" form="review-form" disabled={saving}>
				{saving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</div>

	<form id="review-form" method="POST" action="?/save" onsubmit={handleSubmit} class="space-y-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="title">Title</Label>
					<Input
						id="title"
						name="title"
						value={title}
						oninput={handleTitleInput}
						placeholder="Review title"
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={slug} placeholder="review-slug" required />
				</div>

				<div class="space-y-2">
					<Label for="game_title">Game Title</Label>
					<Input
						id="game_title"
						name="game_title"
						value={game_title}
						placeholder="The game being reviewed"
					/>
				</div>

				<div class="space-y-2">
					<Label for="game_platform">Platform</Label>
					<Input
						id="game_platform"
						name="game_platform"
						value={game_platform}
						placeholder="PC, PS5, Xbox, Switch, etc."
					/>
				</div>

				<div class="space-y-2">
					<Label for="rating">Rating: {rating}/10</Label>
					<input
						type="range"
						id="rating"
						name="rating"
						min="1"
						max="10"
						bind:value={rating}
						class="w-full"
					/>
					<div class="flex justify-between text-xs text-muted-foreground">
						<span>1</span>
						<span>10</span>
					</div>
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
