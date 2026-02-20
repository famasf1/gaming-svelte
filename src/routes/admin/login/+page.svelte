<script lang="ts">
	import { supabaseBrowserClient } from '$lib/supabase';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin() {
		loading = true;
		error = '';

		const { error: authError } = await supabaseBrowserClient.auth.signInWithPassword({
			email,
			password
		});

		if (authError) {
			error = authError.message;
			loading = false;
			return;
		}

		window.location.href = '/admin';
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md space-y-6 rounded-lg border bg-card p-6">
		<div class="space-y-2 text-center">
			<h1 class="text-2xl font-bold">Admin Login</h1>
			<p class="text-muted-foreground">Enter your credentials to access the CMS</p>
		</div>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
			class="space-y-4"
		>
			{#if error}
				<div class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
			{/if}

			<div class="space-y-2">
				<label for="email" class="text-sm font-medium">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="admin@example.com"
					class="w-full rounded-lg border bg-background px-3 py-2"
					required
				/>
			</div>

			<div class="space-y-2">
				<label for="password" class="text-sm font-medium">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="w-full rounded-lg border bg-background px-3 py-2"
					required
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>
	</div>
</div>
