<script lang="ts">
	let {
		value,
		choiceA,
		choiceB,
		onValueChange
	}: {
		value: number;
		choiceA: string;
		choiceB: string;
		onValueChange: (value: number) => void;
	} = $props();
</script>

<div class="spectrum-slider">
	<div class="labels">
		<span class="label-a">{choiceA}</span>
		<span class="label-b">{choiceB}</span>
	</div>
	<input
		type="range"
		min="0"
		max="100"
		{value}
		class="slider"
		oninput={(e) => onValueChange(Number(e.currentTarget.value))}
	/>
	<div class="value-display">{value}</div>
</div>

<style>
	.spectrum-slider {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.label-a {
		color: #e94560;
		text-align: left;
		max-width: 45%;
	}

	.label-b {
		color: #53d8fb;
		text-align: right;
		max-width: 45%;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 12px;
		border-radius: 6px;
		background: linear-gradient(90deg, #e94560 0%, #888 50%, #53d8fb 100%);
		outline: none;
		cursor: pointer;
		touch-action: none;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid #ccc;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #fff;
		border: 3px solid #ccc;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}

	.value-display {
		text-align: center;
		font-size: 0.85rem;
		color: #888;
		font-variant-numeric: tabular-nums;
	}
</style>
