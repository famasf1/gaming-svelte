<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Users</h1>
	</div>

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Email</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Created</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Last Login</th>
				</tr>
			</thead>
			<tbody>
				{#if data.users.length > 0}
					{#each data.users as user}
						<tr class="border-b">
							<td class="px-4 py-3 font-medium">{user.email}</td>
							<td class="px-4 py-3">
								<Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
									{user.email_confirmed_at ? 'Verified' : 'Pending'}
								</Badge>
							</td>
							<td class="px-4 py-3 text-muted-foreground">
								{new Date(user.created_at).toLocaleDateString()}
							</td>
							<td class="px-4 py-3 text-muted-foreground">
								{user.last_sign_in_at
									? new Date(user.last_sign_in_at).toLocaleDateString()
									: 'Never'}
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="4" class="px-4 py-8 text-center text-muted-foreground">
							No users found.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
