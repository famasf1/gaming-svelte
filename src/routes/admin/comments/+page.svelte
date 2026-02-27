<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold">Comments</h1>

	<div class="flex gap-2">
		<a
			href="/admin/comments?filter=pending"
			class="rounded-lg px-3 py-1 {data.filter === 'pending'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Pending
		</a>
		<a
			href="/admin/comments?filter=approved"
			class="rounded-lg px-3 py-1 {data.filter === 'approved'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			Approved
		</a>
		<a
			href="/admin/comments?filter=all"
			class="rounded-lg px-3 py-1 {data.filter === 'all'
				? 'bg-primary text-primary-foreground'
				: 'bg-muted'}"
		>
			All
		</a>
	</div>

	<div class="rounded-lg border">
		<table class="w-full">
			<thead class="border-b bg-muted/50">
				<tr>
					<th class="px-4 py-3 text-left text-sm font-medium">Article</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Name</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Comment</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Date</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if data.comments.length > 0}
					{#each data.comments as comment}
						<tr class="border-b">
							<td class="px-4 py-3">
								<a
									href="/articles/{comment.articles?.slug}"
									target="_blank"
									class="text-primary hover:underline"
								>
									{comment.articles?.title || 'Unknown'}
								</a>
							</td>
							<td class="px-4 py-3">
								<div class="font-medium">{comment.name}</div>
								<div class="text-sm text-muted-foreground">{comment.email}</div>
							</td>
							<td class="max-w-xs truncate px-4 py-3" title={comment.content}>
								{comment.content}
							</td>
							<td class="px-4 py-3">
								<Badge variant={comment.is_approved ? 'default' : 'secondary'}>
									{comment.is_approved ? 'Approved' : 'Pending'}
								</Badge>
							</td>
							<td class="px-4 py-3 text-muted-foreground">
								{new Date(comment.created_at).toLocaleDateString()}
							</td>
							<td class="px-4 py-3">
								<div class="flex gap-2">
									{#if !comment.is_approved}
										<form method="POST" action="?/approve" use:enhance>
											<input type="hidden" name="id" value={comment.id} />
											<Button size="sm" variant="secondary">Approve</Button>
										</form>
									{/if}
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={comment.id} />
										<Button size="sm" variant="destructive">Delete</Button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="6" class="px-4 py-8 text-center text-muted-foreground">
							No comments found.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
