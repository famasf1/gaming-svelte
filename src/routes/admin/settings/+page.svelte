<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data } = $props();

	let saving = $state(false);
</script>

<div class="mx-auto max-w-2xl space-y-6">
	<h1 class="text-2xl font-bold">Settings</h1>

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ result }) => {
				saving = false;
				if (result.type === 'success') {
					alert('Settings saved successfully!');
				}
			};
		}}
		class="space-y-6"
	>
		<div class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">General</h2>

			<div class="space-y-2">
				<Label for="site_name">Site Name</Label>
				<Input
					id="site_name"
					name="site_name"
					value={data.settings.site_name?.value ?? ''}
					placeholder="My Gaming Blog"
				/>
				<p class="text-sm text-muted-foreground">
					{data.settings.site_name?.description ?? ''}
				</p>
			</div>

			<div class="space-y-2">
				<Label for="site_description">Site Description</Label>
				<Textarea
					id="site_description"
					name="site_description"
					placeholder="Your blog description"
					rows={3}
				>
					{data.settings.site_description?.value ?? ''}
				</Textarea>
				<p class="text-sm text-muted-foreground">
					{data.settings.site_description?.description ?? ''}
				</p>
			</div>

			<div class="space-y-2">
				<Label for="site_logo">Site Logo URL</Label>
				<Input
					id="site_logo"
					name="site_logo"
					value={data.settings.site_logo?.value ?? ''}
					placeholder="https://example.com/logo.png"
				/>
			</div>
		</div>

		<div class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">Content</h2>

			<div class="space-y-2">
				<Label for="posts_per_page">Posts Per Page</Label>
				<Input
					id="posts_per_page"
					name="posts_per_page"
					type="number"
					min="1"
					max="50"
					value={data.settings.posts_per_page?.value ?? '10'}
				/>
				<p class="text-sm text-muted-foreground">
					{data.settings.posts_per_page?.description ?? ''}
				</p>
			</div>

			<div class="space-y-2">
				<Label for="default_image">Default Featured Image URL</Label>
				<Input
					id="default_image"
					name="default_image"
					value={data.settings.default_image?.value ?? ''}
					placeholder="https://example.com/default.png"
				/>
			</div>
		</div>

		<div class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">Comments</h2>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="allow_comments"
					name="allow_comments"
					checked={data.settings.allow_comments?.value !== 'false'}
					class="h-4 w-4"
				/>
				<Label for="allow_comments">Allow comments on articles</Label>
			</div>

			<div class="flex items-center gap-2">
				<input
					type="checkbox"
					id="comments_require_approval"
					name="comments_require_approval"
					checked={data.settings.comments_require_approval?.value !== 'false'}
					class="h-4 w-4"
				/>
				<Label for="comments_require_approval">Require moderation for comments</Label>
			</div>
			<p class="text-sm text-muted-foreground">
				{data.settings.comments_require_approval?.description ?? ''}
			</p>
		</div>

		<Button type="submit" disabled={saving}>
			{saving ? 'Saving...' : 'Save Settings'}
		</Button>
	</form>
</div>
