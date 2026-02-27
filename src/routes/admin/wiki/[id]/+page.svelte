<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Editor } from '$lib/components/editor';

	let { data } = $props();

	let title = $state(data.wiki?.title ?? '');
	let slug = $state(data.wiki?.slug ?? '');
	let content = $state(data.wiki?.content ?? '');
	let game_title = $state(data.wiki?.game_title ?? '');
	let category = $state(data.wiki?.category ?? 'guides');
	let is_published = $state(data.wiki?.is_published ?? false);

	let saving = $state(false);

	const categories = [
		{ value: 'tips', label: 'Tips' },
		{ value: 'guides', label: 'Guides' },
		{ value: 'achievements', label: 'Achievements' },
		{ value: 'lore', label: 'Lore' },
		{ value: 'other', label: 'Other' }
	];

	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
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
		formData.set('is_published', is_published ? 'on' : '');
		if (data.wiki?.id) {
			formData.set('id', data.wiki.id.toString());
		}

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				goto('/admin/wiki');
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
		<h1 class="text-2xl font-bold">{data.wiki ? 'Edit Wiki Entry' : 'New Wiki Entry'}</h1>
		<div class="flex gap-2">
			<Button href="/admin/wiki">Cancel</Button>
			<Button type="submit" form="wiki-form" disabled={saving}>
				{saving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</div>

	<form id="wiki-form" method="POST" action="?/save" onsubmit={handleSubmit} class="space-y-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="title">Title</Label>
					<Input
						id="title"
						name="title"
						value={title}
						oninput={handleTitleInput}
						placeholder="Wiki entry title"
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={slug} placeholder="wiki-slug" required />
				</div>

				<div class="space-y-2">
					<Label for="game_title">Game Title</Label>
					<Input
						id="game_title"
						name="game_title"
						value={game_title}
						placeholder="e.g., Zelda: Tears of the Kingdom"
					/>
				</div>

				<div class="space-y-2">
					<Label for="category">Category</Label>
					<select
						id="category"
						name="category"
						bind:value={category}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					>
						{#each categories as cat}
							<option value={cat.value}>{cat.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-center gap-2">
					<Switch id="is_published" bind:checked={is_published} />
					<Label for="is_published">Published</Label>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<Label>Content</Label>
			<Editor bind:content />
		</div>
	</form>
</div>
