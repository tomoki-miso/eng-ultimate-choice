<script lang="ts">
	import type { Question } from '$lib/data/questions';
	import VoteBar from './VoteBar.svelte';

	let {
		question,
		onClose,
		votes = undefined,
		onCloseVoting = undefined
	}: {
		question: Question;
		onClose: () => void;
		votes?: { A: number; B: number };
		onCloseVoting?: () => void;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onCloseVoting?.();
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onCloseVoting?.();
			onClose();
		}
	}

	function handleClose() {
		onCloseVoting?.();
		onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div class="backdrop" onclick={handleBackdropClick}>
	<div class="modal" class:has-votes={votes}>
		<div class="choice choice-a">
			<span class="label">A</span>
			<span class="text">{question.choiceA}</span>
		</div>
		<div class="vs">or</div>
		<div class="choice choice-b">
			<span class="label">B</span>
			<span class="text">{question.choiceB}</span>
		</div>
		{#if votes}
			<div class="vote-section">
				<VoteBar {votes} />
			</div>
		{/if}
		<button class="close-btn" onclick={handleClose}>閉じる</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 24px;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal {
		background: linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%);
		border: 2px solid #53d8fb;
		box-shadow:
			0 0 40px rgba(83, 216, 251, 0.2),
			0 20px 60px rgba(0, 0, 0, 0.5);
		border-radius: 20px;
		padding: 40px 32px;
		width: 320px;
		aspect-ratio: 3 / 4;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		animation: slideUp 0.3s ease-out;
	}

	.choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
	}

	.label {
		font-size: 1rem;
		font-weight: 700;
		border-radius: 6px;
		padding: 2px 14px;
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
		font-size: 1.4rem;
		color: #e0e0e0;
		line-height: 1.4;
		font-weight: 600;
	}

	.vs {
		font-size: 1rem;
		font-weight: 700;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.vote-section {
		width: 100%;
		padding: 0 4px;
	}

	.has-votes {
		aspect-ratio: auto;
		min-height: 360px;
	}

	.close-btn {
		margin-top: 12px;
		background: transparent;
		border: 1.5px solid #888;
		color: #888;
		padding: 8px 28px;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.close-btn:hover {
		border-color: #e0e0e0;
		color: #e0e0e0;
	}

	@media (max-width: 600px) {
		.modal {
			width: 260px;
			padding: 32px 20px;
		}

		.text {
			font-size: 1.1rem;
		}
	}
</style>
