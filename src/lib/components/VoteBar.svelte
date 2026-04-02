<script lang="ts">
	let { votes }: { votes: { A: number; B: number } } = $props();

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
	.total {
		text-align: center;
		font-size: 0.75rem;
		color: #888;
	}
</style>
