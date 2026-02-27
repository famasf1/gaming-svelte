<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';

	let { data } = $props();

	let title = $state('');
	let slug = $state('');
	let content = $state('');

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
	<form method="POST" class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold">New Page</h1>
			<Button type="submit">Save</Button>
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
	</form>
</div>
