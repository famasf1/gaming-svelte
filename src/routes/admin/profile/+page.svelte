<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Facebook,
		Twitter,
		Youtube,
		Twitch,
		MessageCircle,
		Instagram,
		Linkedin,
		Github,
		ImageIcon
	} from 'lucide-svelte';

	let { data } = $props();

	let saving = $state(false);
	let message = $state<{ type: 'success' | 'error'; text: string } | null>(null);

	let showMediaPicker = $state(false);
</script>

<div class="mx-auto max-w-2xl space-y-6">
	<h1 class="text-2xl font-bold">Profile</h1>

	{#if message}
		<div
			class="rounded-lg p-4 {message.type === 'success'
				? 'bg-green-50 text-green-800'
				: 'bg-red-50 text-red-800'}"
		>
			{message.text}
		</div>
	{/if}

	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ result }) => {
				saving = false;
				if (result.type === 'success') {
					message = { type: 'success', text: 'Profile saved successfully!' };
				} else if (result.type === 'failure') {
					message = {
						type: 'error',
						text: (result.data as { message?: string })?.message || 'Failed to save profile'
					};
				}
			};
		}}
		class="space-y-6"
	>
		<div class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">Basic Information</h2>

			<div class="space-y-2">
				<Label>Avatar</Label>
				<div class="flex items-center gap-4">
					{#if data.user.avatar_url}
						<img
							src={data.user.avatar_url}
							alt="Avatar"
							class="h-20 w-20 rounded-full object-cover"
						/>
					{:else}
						<div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<ImageIcon class="h-8 w-8 text-muted-foreground" />
						</div>
					{/if}
					<div class="space-y-2">
						<Input
							id="avatar_url"
							name="avatar_url"
							value={data.user.avatar_url}
							placeholder="https://example.com/avatar.jpg"
							class="max-w-md"
						/>
						<p class="text-sm text-muted-foreground">
							Enter avatar URL or select from media library
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<Label for="display_name">Display Name</Label>
				<Input
					id="display_name"
					name="display_name"
					value={data.user.display_name}
					placeholder="Your display name"
				/>
			</div>

			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input id="email" value={data.user.email} disabled class="bg-muted" />
				<p class="text-sm text-muted-foreground">Email cannot be changed</p>
			</div>

			<div class="space-y-2">
				<Label for="bio">Bio</Label>
				<Textarea
					id="bio"
					name="bio"
					value={data.user.bio}
					placeholder="Short bio about yourself"
					rows={4}
				/>
			</div>
		</div>

		<div class="space-y-4 rounded-lg border p-4">
			<h2 class="text-lg font-semibold">Social Links</h2>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="facebook" class="flex items-center gap-2">
						<Facebook class="h-4 w-4" />
						Facebook
					</Label>
					<Input
						id="facebook"
						name="facebook"
						value={data.user.facebook}
						placeholder="https://facebook.com/username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="twitter" class="flex items-center gap-2">
						<Twitter class="h-4 w-4" />
						X (Twitter)
					</Label>
					<Input
						id="twitter"
						name="twitter"
						value={data.user.twitter}
						placeholder="https://x.com/username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="youtube" class="flex items-center gap-2">
						<Youtube class="h-4 w-4" />
						YouTube
					</Label>
					<Input
						id="youtube"
						name="youtube"
						value={data.user.youtube}
						placeholder="https://youtube.com/@username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="twitch" class="flex items-center gap-2">
						<Twitch class="h-4 w-4" />
						Twitch
					</Label>
					<Input
						id="twitch"
						name="twitch"
						value={data.user.twitch}
						placeholder="https://twitch.tv/username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="discord" class="flex items-center gap-2">
						<MessageCircle class="h-4 w-4" />
						Discord
					</Label>
					<Input
						id="discord"
						name="discord"
						value={data.user.discord}
						placeholder="discord.gg/invite or username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="instagram" class="flex items-center gap-2">
						<Instagram class="h-4 w-4" />
						Instagram
					</Label>
					<Input
						id="instagram"
						name="instagram"
						value={data.user.instagram}
						placeholder="https://instagram.com/username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="linkedin" class="flex items-center gap-2">
						<Linkedin class="h-4 w-4" />
						LinkedIn
					</Label>
					<Input
						id="linkedin"
						name="linkedin"
						value={data.user.linkedin}
						placeholder="https://linkedin.com/in/username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="github" class="flex items-center gap-2">
						<Github class="h-4 w-4" />
						GitHub
					</Label>
					<Input
						id="github"
						name="github"
						value={data.user.github}
						placeholder="https://github.com/username"
					/>
				</div>
			</div>
		</div>

		<Button type="submit" disabled={saving}>
			{saving ? 'Saving...' : 'Save Profile'}
		</Button>
	</form>

	<div class="space-y-4 rounded-lg border p-4">
		<h2 class="text-lg font-semibold">Change Password</h2>

		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
				saving = true;
				return async ({ result }) => {
					saving = false;
					if (result.type === 'success') {
						message = { type: 'success', text: 'Password changed successfully!' };
					} else if (result.type === 'failure') {
						message = {
							type: 'error',
							text: (result.data as { message?: string })?.message || 'Failed to change password'
						};
					}
				};
			}}
			class="space-y-4"
		>
			<div class="space-y-2">
				<Label for="current_password">Current Password</Label>
				<Input id="current_password" name="current_password" type="password" required />
			</div>

			<div class="space-y-2">
				<Label for="new_password">New Password</Label>
				<Input id="new_password" name="new_password" type="password" required minlength={6} />
				<p class="text-sm text-muted-foreground">Minimum 6 characters</p>
			</div>

			<Button type="submit" variant="secondary" disabled={saving}>Change Password</Button>
		</form>
	</div>

	<div class="space-y-4 rounded-lg border p-4">
		<h2 class="text-lg font-semibold">Logout</h2>
		<p class="text-sm text-muted-foreground">Sign out of your account on this device.</p>
		<form method="POST" action="?/logout">
			<Button type="submit" variant="destructive">Sign Out</Button>
		</form>
	</div>
</div>
