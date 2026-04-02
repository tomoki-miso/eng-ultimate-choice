<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateRoomCode } from '$lib/utils/roomCode';

	let joinCode = $state('');
	let error = $state('');

	function createRoom() {
		const code = generateRoomCode();
		goto(`/room/${code}`);
	}

	function joinRoom() {
		const code = joinCode.trim().toUpperCase();
		if (code.length !== 4) {
			error = '4文字のルームコードを入力してください';
			return;
		}
		error = '';
		goto(`/room/${code}/join`);
	}
</script>

<svelte:head>
	<title>エンジニア究極の二択</title>
</svelte:head>

<div class="container">
	<h1>エンジニア究極の二択</h1>
	<p class="subtitle">エンジニア交流会アイスブレイク</p>

	<div class="actions">
		<div class="card">
			<h2>ホスト</h2>
			<button class="btn btn-primary" onclick={createRoom}>ルームを作成</button>
		</div>

		<div class="card">
			<h2>参加者</h2>
			<form onsubmit={(e) => { e.preventDefault(); joinRoom(); }}>
				<input
					type="text"
					bind:value={joinCode}
					placeholder="ルームコード"
					maxlength="4"
					class="code-input"
				/>
				{#if error}
					<p class="error">{error}</p>
				{/if}
				<button type="submit" class="btn btn-secondary">参加する</button>
			</form>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 48px 16px;
		text-align: center;
	}

	h1 {
		font-size: 2rem;
		font-weight: 800;
		background: linear-gradient(90deg, #e94560, #53d8fb);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 8px;
	}

	.subtitle {
		color: #888;
		margin: 0 0 48px;
		font-size: 1rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.card {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		border: 1.5px solid #333;
		border-radius: 16px;
		padding: 32px 24px;
	}

	.card h2 {
		margin: 0 0 8px;
		font-size: 1.2rem;
		color: #e0e0e0;
	}

	.card p {
		margin: 0 0 20px;
		color: #888;
		font-size: 0.9rem;
	}

	.btn {
		display: inline-block;
		padding: 12px 32px;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-family: inherit;
		border: none;
		width: 100%;
	}

	.btn-primary {
		background: #e94560;
		color: #fff;
	}

	.btn-primary:hover {
		background: #d63b55;
	}

	.btn-secondary {
		background: #53d8fb;
		color: #1a1a2e;
	}

	.btn-secondary:hover {
		background: #3cc5e8;
	}

	.code-input {
		display: block;
		width: 100%;
		padding: 12px;
		border: 1.5px solid #444;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.05);
		color: #e0e0e0;
		font-size: 1.4rem;
		text-align: center;
		letter-spacing: 0.3em;
		font-family: inherit;
		text-transform: uppercase;
		margin-bottom: 12px;
		box-sizing: border-box;
	}

	.code-input::placeholder {
		color: #555;
		letter-spacing: 0.1em;
		font-size: 1rem;
	}

	.code-input:focus {
		outline: none;
		border-color: #53d8fb;
	}

	.error {
		color: #e94560;
		font-size: 0.85rem;
		margin: -4px 0 8px;
	}
</style>
