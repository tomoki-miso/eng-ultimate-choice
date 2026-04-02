<script lang="ts">
	import type { Question } from '$lib/data/questions';

	let { question, flipped, onFlip }: { question: Question; flipped: boolean; onFlip: () => void } =
		$props();
</script>

<button class="card" class:flipped onclick={flipped ? undefined : onFlip} disabled={flipped}>
	<div class="card-inner">
		<div class="card-front">
			<span class="card-icon">?</span>
		</div>
		<div class="card-back">
			<div class="choice choice-a">
				<span class="label">A</span>
				<span class="text">{question.choiceA}</span>
			</div>
			<div class="vs">or</div>
			<div class="choice choice-b">
				<span class="label">B</span>
				<span class="text">{question.choiceB}</span>
			</div>
		</div>
	</div>
</button>

<style>
	.card {
		perspective: 800px;
		width: 100%;
		aspect-ratio: 3 / 4;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: inherit;
	}

	.card:disabled {
		cursor: default;
	}

	.card:not(.flipped):hover .card-inner {
		transform: rotateY(10deg);
	}

	.card:not(.flipped):active .card-inner {
		transform: rotateY(20deg);
	}

	.card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 12px;
	}

	.flipped .card-inner {
		transform: rotateY(180deg);
	}

	.card-front,
	.card-back {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 12px;
	}

	.card-front {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
		border: 2px solid #e94560;
		box-shadow: 0 0 20px rgba(233, 69, 96, 0.15);
	}

	.card-icon {
		font-size: 3rem;
		font-weight: 700;
		color: #e94560;
		text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
	}

	.card-back {
		background: linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%);
		border: 2px solid #53d8fb;
		box-shadow: 0 0 20px rgba(83, 216, 251, 0.15);
		transform: rotateY(180deg);
		gap: 8px;
	}

	.choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		text-align: center;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 4px;
		padding: 1px 8px;
		letter-spacing: 0.05em;
	}

	.choice-a .label {
		background: #e94560;
		color: #fff;
	}

	.choice-b .label {
		background: #53d8fb;
		color: #1a1a2e;
	}

	.text {
		font-size: 0.85rem;
		color: #e0e0e0;
		line-height: 1.3;
	}

	.vs {
		font-size: 0.75rem;
		font-weight: 700;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	@media (max-width: 600px) {
		.card-icon {
			font-size: 2rem;
		}

		.text {
			font-size: 0.75rem;
		}
	}
</style>
