<script lang="ts">
	let {
		votes,
		voterNames = undefined
	}: {
		votes: { A: number; B: number };
		voterNames?: { A: string[]; B: string[] };
	} = $props();

	let total = $derived(votes.A + votes.B);
	let percentA = $derived(total === 0 ? 50 : Math.round((votes.A / total) * 100));
	let percentB = $derived(total === 0 ? 50 : 100 - percentA);
</script>

<div class="vote-bar-container">
	<div class="vote-labels">
		<span class="label-a">A: {votes.A}票 ({percentA}%)</span>
		<span class="label-b">B: {votes.B}票 ({percentB}%)</span>
	</div>
	<div class="vote-bar">
		<div class="bar-a" style="width: {percentA}%"></div>
		<div class="bar-b" style="width: {percentB}%"></div>
	</div>
	{#if voterNames && (voterNames.A.length > 0 || voterNames.B.length > 0)}
		<div class="voter-lists">
			<div class="voter-group voter-group-a">
				{#each voterNames.A as name}
					<span class="voter-name voter-a">{name}</span>
				{/each}
			</div>
			<div class="voter-group voter-group-b">
				{#each voterNames.B as name}
					<span class="voter-name voter-b">{name}</span>
				{/each}
			</div>
		</div>
	{/if}
	<div class="total">合計 {total} 票</div>
</div>

<style>
	.vote-bar-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.vote-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.label-a {
		color: #e94560;
	}
	.label-b {
		color: #53d8fb;
	}
	.vote-bar {
		display: flex;
		height: 28px;
		border-radius: 14px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.05);
	}
	.bar-a {
		background: linear-gradient(90deg, #e94560, #c73a54);
		transition: width 0.4s ease-out;
		min-width: 4px;
	}
	.bar-b {
		background: linear-gradient(90deg, #3ab8d8, #53d8fb);
		transition: width 0.4s ease-out;
		min-width: 4px;
	}
	.voter-lists {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 2px;
	}
	.voter-group {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		flex: 1;
	}
	.voter-group-a {
		justify-content: flex-start;
	}
	.voter-group-b {
		justify-content: flex-end;
	}
	.voter-name {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 1px 8px;
		border-radius: 8px;
	}
	.voter-a {
		color: #e94560;
		background: rgba(233, 69, 96, 0.12);
		border: 1px solid rgba(233, 69, 96, 0.25);
	}
	.voter-b {
		color: #53d8fb;
		background: rgba(83, 216, 251, 0.12);
		border: 1px solid rgba(83, 216, 251, 0.25);
	}
	.total {
		text-align: center;
		font-size: 0.75rem;
		color: #888;
	}
</style>
