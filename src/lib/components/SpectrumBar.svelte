<script lang="ts">
	import type { SpectrumVoter } from '$lib/types/room';

	let {
		spectrumVoters
	}: {
		spectrumVoters: Record<string, SpectrumVoter>;
	} = $props();

	let voters = $derived(Object.values(spectrumVoters));
	let count = $derived(voters.length);
	let average = $derived(
		count === 0 ? 50 : Math.round(voters.reduce((sum, v) => sum + v.value, 0) / count)
	);
</script>

<div class="spectrum-bar-container">
	<div class="bar">
		{#each Object.entries(spectrumVoters) as [id, voter] (id)}
			<div
				class="dot"
				style="left: {voter.value}%"
				title={voter.name}
			>
				<span class="dot-label">{voter.name}</span>
			</div>
		{/each}
		<div class="average-marker" style="left: {average}%"></div>
	</div>
	<div class="stats">
		<span>平均: {average}</span>
		<span>参加者: {count}人</span>
	</div>
</div>

<style>
	.spectrum-bar-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.bar {
		position: relative;
		height: 28px;
		border-radius: 14px;
		background: linear-gradient(90deg, #e94560 0%, #888 50%, #53d8fb 100%);
		overflow: visible;
	}

	.dot {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid rgba(0, 0, 0, 0.3);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		transition: left 0.3s ease-out;
		z-index: 2;
	}

	.dot-label {
		position: absolute;
		top: -22px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.65rem;
		font-weight: 600;
		color: #e0e0e0;
		white-space: nowrap;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
	}

	.average-marker {
		position: absolute;
		top: -4px;
		bottom: -4px;
		width: 2px;
		background: #fff;
		border: 1px dashed rgba(255, 255, 255, 0.6);
		transform: translateX(-50%);
		transition: left 0.3s ease-out;
		z-index: 1;
	}

	.stats {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: #888;
	}
</style>
