<script lang="ts">
	import { onMount } from 'svelte';
	import { questions } from '$lib/data/questions';
	import { shuffleAndPick } from '$lib/utils/shuffle';
	import { RoomState } from '$lib/firebase/roomState.svelte';
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Question } from '$lib/data/questions';

	let { data } = $props();
	let room = $state<RoomState | null>(null);
	let modalQuestion = $state<Question | null>(null);
	let initialized = $state(false);

	let flippedSet = $derived(new Set(room?.flippedIds ?? []));
	let flippedCount = $derived(flippedSet.size);
	let joinUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/room/${data.roomId}/join`
			: ''
	);
	let copied = $state(false);

	async function copyLink() {
		await navigator.clipboard.writeText(joinUrl);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	onMount(() => {
		const r = new RoomState(data.roomId);
		room = r;

		const selected = shuffleAndPick(questions, 16);
		r.createRoom(selected).then(() => {
			r.connect();
			initialized = true;
		});

		return () => r.destroy();
	});

	function handleFlip(id: number) {
		if (!room) return;
		room.flipCard(id);
		const q = room.questions.find((q) => q.id === id);
		if (q) {
			setTimeout(() => {
				modalQuestion = q;
			}, 400);
		}
	}

	function closeModal() {
		room?.closeVoting();
		modalQuestion = null;
	}

	function reset() {
		if (!room) return;
		const selected = shuffleAndPick(questions, 16);
		room.reset(selected);
		modalQuestion = null;
	}
</script>

<svelte:head>
	<title>ホスト - エンジニア究極の二択</title>
</svelte:head>

{#if room && initialized}
	<div class="container">
		<header>
			<h1>エンジニア究極の二択</h1>
			<div class="room-info">
				<span class="room-code">ルーム: {data.roomId}</span>
				<span class="participant-count">参加者: {room.participantCount}人</span>
			</div>
			{#if room.participants.length > 0}
				<div class="participant-names">
					{#each room.participants.filter(p => p.name) as p}
						<span class="participant-tag">{p.name}</span>
					{/each}
				</div>
			{/if}
			<div class="join-info">
				<span class="join-url">{joinUrl}</span>
				<button class="copy-btn" onclick={copyLink}>
					{copied ? 'コピー済み!' : 'コピー'}
				</button>
			</div>
			<div class="controls">
				<span class="counter">{flippedCount} / {room.questions.length}</span>
				<button class="reset-btn" onclick={reset}>リセット</button>
			</div>
		</header>

		<div class="grid">
			{#each room.questions as question (question.id)}
				<Card {question} flipped={flippedSet.has(question.id)} onFlip={() => handleFlip(question.id)} />
			{/each}
		</div>
	</div>

	{#if modalQuestion}
		<Modal
			question={modalQuestion}
			onClose={() => { modalQuestion = null; }}
			votes={room.votes}
			onCloseVoting={() => room?.closeVoting()}
		/>
	{/if}
{:else}
	<div class="loading">接続中...</div>
{/if}

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 24px 16px;
	}

	header {
		text-align: center;
		margin-bottom: 32px;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 800;
		background: linear-gradient(90deg, #e94560, #53d8fb);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 12px;
	}

	.room-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 8px;
	}

	.room-code {
		font-size: 1.1rem;
		font-weight: 700;
		color: #53d8fb;
		letter-spacing: 0.1em;
	}

	.participant-count {
		font-size: 0.95rem;
		color: #888;
	}

	.participant-names {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin-bottom: 8px;
	}

	.participant-tag {
		font-size: 0.75rem;
		color: #aaa;
		background: rgba(83, 216, 251, 0.1);
		border: 1px solid rgba(83, 216, 251, 0.2);
		border-radius: 12px;
		padding: 2px 10px;
	}

	.join-info {
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.join-url {
		font-size: 0.8rem;
		color: #666;
		word-break: break-all;
	}

	.copy-btn {
		background: transparent;
		border: 1px solid #53d8fb;
		color: #53d8fb;
		padding: 3px 12px;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
		white-space: nowrap;
	}

	.copy-btn:hover {
		background: #53d8fb;
		color: #1a1a2e;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.counter {
		font-size: 1.1rem;
		font-weight: 600;
		color: #888;
		font-variant-numeric: tabular-nums;
	}

	.reset-btn {
		background: transparent;
		border: 1.5px solid #e94560;
		color: #e94560;
		padding: 6px 20px;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.reset-btn:hover {
		background: #e94560;
		color: #fff;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		color: #888;
		font-size: 1.2rem;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 1.3rem;
		}

		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.container {
			padding: 16px 10px;
		}
	}
</style>
