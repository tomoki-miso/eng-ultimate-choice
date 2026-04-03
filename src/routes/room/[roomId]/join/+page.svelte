<script lang="ts">
	import { RoomState } from '$lib/firebase/roomState.svelte';
	import VoteBar from '$lib/components/VoteBar.svelte';
	import SpectrumSlider from '$lib/components/SpectrumSlider.svelte';
	import SpectrumBar from '$lib/components/SpectrumBar.svelte';

	let { data } = $props();
	let room = $state<RoomState | null>(null);
	let userName = $state('');
	let joined = $state(false);

	let currentQuestion = $derived.by(() => {
		if (!room || room.currentQuestionId === null) return null;
		return room.questions.find((q) => q.id === room!.currentQuestionId) ?? null;
	});

	let spectrumValue = $state(50);

	let state = $derived.by(() => {
		if (!joined) return 'name-entry' as const;
		if (!room?.connected) return 'connecting' as const;
		if (!currentQuestion) return 'waiting' as const;
		if (room.votingMode === 'spectrum' && room.votingOpen) return 'spectrum' as const;
		if (room.myVote) return 'voted' as const;
		if (room.votingOpen) return 'voting' as const;
		return 'waiting' as const;
	});

	// Auto-submit initial spectrum value when entering spectrum mode
	$effect(() => {
		if (state === 'spectrum' && room && room.mySpectrumValue === null) {
			spectrumValue = 50;
			room.voteSpectrum(50);
		}
	});

	function join() {
		const name = userName.trim();
		if (!name) return;
		const r = new RoomState(data.roomId);
		room = r;
		r.connect(name);
		joined = true;
	}

	function vote(choice: 'A' | 'B') {
		room?.vote(choice);
	}

	$effect(() => {
		return () => room?.destroy();
	});
</script>

<svelte:head>
	<title>投票 - エンジニア究極の二択</title>
</svelte:head>

<div class="container">
	<header>
		<h1>エンジニア究極の二択</h1>
		<span class="room-code">ルーム: {data.roomId}</span>
	</header>

	{#if state === 'name-entry'}
		<div class="name-entry">
			<p class="name-prompt">名前を入力してください</p>
			<form onsubmit={(e) => { e.preventDefault(); join(); }}>
				<input
					type="text"
					bind:value={userName}
					placeholder="あなたの名前"
					maxlength="20"
					class="name-input"
				/>
				<button type="submit" class="join-btn" disabled={!userName.trim()}>参加する</button>
			</form>
		</div>
	{:else if state === 'connecting'}
		<div class="status">接続中...</div>
	{:else if state === 'waiting'}
		<div class="status">
			<div class="waiting-icon">⏳</div>
			<p>次のカードを待っています...</p>
			{#if room}
				<p class="participant-info">参加者: {room.participantCount}人</p>
			{/if}
		</div>
	{:else if state === 'spectrum' && currentQuestion && room}
		<div class="spectrum-display">
			<div class="question-summary">
				<p class="choice-text">
					<span class="label-inline a">A</span> {currentQuestion.choiceA}
				</p>
				<p class="choice-text">
					<span class="label-inline b">B</span> {currentQuestion.choiceB}
				</p>
			</div>
			<SpectrumSlider
				value={spectrumValue}
				choiceA={currentQuestion.choiceA}
				choiceB={currentQuestion.choiceB}
				onValueChange={(v) => { spectrumValue = v; room?.voteSpectrum(v); }}
			/>
			<SpectrumBar spectrumVoters={room.spectrumVoters} />
		</div>
	{:else if state === 'voting' && currentQuestion}
		<div class="question-display">
			<div class="choice-btn-wrapper">
				<button class="choice-btn choice-a" onclick={() => vote('A')}>
					<span class="label">A</span>
					<span class="text">{currentQuestion.choiceA}</span>
				</button>
			</div>
			<div class="vs">or</div>
			<div class="choice-btn-wrapper">
				<button class="choice-btn choice-b" onclick={() => vote('B')}>
					<span class="label">B</span>
					<span class="text">{currentQuestion.choiceB}</span>
				</button>
			</div>
		</div>
	{:else if state === 'voted' && currentQuestion && room}
		<div class="voted-display">
			<div class="voted-badge">投票済み: {room.myVote}</div>
			<div class="question-summary">
				<p class="choice-text">
					<span class="label-inline a">A</span> {currentQuestion.choiceA}
				</p>
				<p class="choice-text">
					<span class="label-inline b">B</span> {currentQuestion.choiceB}
				</p>
			</div>
			<VoteBar votes={room.votes} voterNames={room.voterNames} />
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 400px;
		margin: 0 auto;
		padding: 24px 16px;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	header {
		text-align: center;
		margin-bottom: 24px;
	}

	h1 {
		font-size: 1.3rem;
		font-weight: 800;
		background: linear-gradient(90deg, #e94560, #53d8fb);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 8px;
	}

	.room-code {
		font-size: 0.9rem;
		font-weight: 700;
		color: #53d8fb;
		letter-spacing: 0.1em;
	}

	.name-entry {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.name-prompt {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: #e0e0e0;
	}

	.name-entry form {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.name-input {
		width: 100%;
		padding: 14px;
		border: 1.5px solid #444;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.05);
		color: #e0e0e0;
		font-size: 1.2rem;
		text-align: center;
		font-family: inherit;
		box-sizing: border-box;
	}

	.name-input::placeholder {
		color: #555;
	}

	.name-input:focus {
		outline: none;
		border-color: #53d8fb;
	}

	.join-btn {
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 10px;
		background: #53d8fb;
		color: #1a1a2e;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
	}

	.join-btn:hover:not(:disabled) {
		background: #3cc5e8;
	}

	.join-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.status {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #888;
		gap: 8px;
	}

	.waiting-icon {
		font-size: 3rem;
	}

	.status p {
		margin: 0;
		font-size: 1.1rem;
	}

	.participant-info {
		font-size: 0.9rem !important;
		color: #666;
	}

	.question-display {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.choice-btn-wrapper {
		width: 100%;
	}

	.choice-btn {
		width: 100%;
		padding: 28px 20px;
		border-radius: 16px;
		border: 2px solid;
		background: rgba(255, 255, 255, 0.03);
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		font-family: inherit;
	}

	.choice-btn:active {
		transform: scale(0.97);
	}

	.choice-a {
		border-color: #e94560;
	}

	.choice-a:hover {
		background: rgba(233, 69, 96, 0.15);
	}

	.choice-b {
		border-color: #53d8fb;
	}

	.choice-b:hover {
		background: rgba(83, 216, 251, 0.15);
	}

	.choice-btn .label {
		font-size: 1.2rem;
		font-weight: 700;
		border-radius: 6px;
		padding: 2px 16px;
	}

	.choice-a .label {
		background: #e94560;
		color: #fff;
	}

	.choice-b .label {
		background: #53d8fb;
		color: #1a1a2e;
	}

	.choice-btn .text {
		font-size: 1.2rem;
		color: #e0e0e0;
		font-weight: 600;
		line-height: 1.4;
	}

	.vs {
		font-size: 1rem;
		font-weight: 700;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.voted-display {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 0 8px;
	}

	.voted-badge {
		font-size: 1.1rem;
		font-weight: 700;
		color: #53d8fb;
		border: 2px solid #53d8fb;
		border-radius: 12px;
		padding: 8px 24px;
	}

	.question-summary {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.choice-text {
		margin: 0;
		font-size: 1rem;
		color: #ccc;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.label-inline {
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 4px;
		padding: 1px 8px;
		flex-shrink: 0;
	}

	.label-inline.a {
		background: #e94560;
		color: #fff;
	}

	.label-inline.b {
		background: #53d8fb;
		color: #1a1a2e;
	}

	.spectrum-display {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
		padding: 0 8px;
	}
</style>
