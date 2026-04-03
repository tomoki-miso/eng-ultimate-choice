import { ref, onValue, set, update, onDisconnect, off } from 'firebase/database';
import { db } from './config';
import type { Question } from '$lib/data/questions';
import type { RoomData, VotingMode, SpectrumVoter } from '$lib/types/room';
import { getVisitorId } from '$lib/utils/visitorId';

export class RoomState {
	roomId: string;
	visitorId: string;

	questions = $state<Question[]>([]);
	flippedIds = $state<number[]>([]);
	currentQuestionId = $state<number | null>(null);
	votingOpen = $state(false);
	votes = $state<{ A: number; B: number }>({ A: 0, B: 0 });
	voterNames = $state<{ A: string[]; B: string[] }>({ A: [], B: [] });
	participantCount = $state(0);
	participants = $state<{ name: string }[]>([]);
	myVote = $state<'A' | 'B' | null>(null);
	connected = $state(false);
	votingMode = $state<VotingMode>('binary');
	spectrumVoters = $state<Record<string, SpectrumVoter>>({});
	mySpectrumValue = $state<number | null>(null);

	private userName?: string;
	private roomRef;
	private presenceRef;
	private myPresenceRef;
	private unsubscribers: (() => void)[] = [];
	private spectrumDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(roomId: string) {
		this.roomId = roomId;
		this.visitorId = getVisitorId();
		this.roomRef = ref(db, `rooms/${roomId}`);
		this.presenceRef = ref(db, `rooms/${roomId}/presence`);
		this.myPresenceRef = ref(db, `rooms/${roomId}/presence/${this.visitorId}`);
	}

	connect(name?: string) {
		this.userName = name;
		// Listen to room data
		const roomUnsub = onValue(this.roomRef, (snapshot) => {
			const data = snapshot.val() as RoomData | null;
			if (!data) return;
			this.questions = data.questions || [];
			this.flippedIds = data.flippedIds || [];
			this.currentQuestionId = data.currentQuestionId ?? null;
			this.votingOpen = data.votingOpen ?? false;
			this.votes = data.votes || { A: 0, B: 0 };
			this.votingMode = data.votingMode || 'binary';
			this.spectrumVoters = data.spectrumVoters || {};
			this.mySpectrumValue = data.spectrumVoters?.[this.visitorId]?.value ?? null;
			this.connected = true;

			// Build voter name lists and check own vote
			if (data.voters) {
				const namesA: string[] = [];
				const namesB: string[] = [];
				let myChoice: 'A' | 'B' | null = null;
				for (const [vid, voter] of Object.entries(data.voters)) {
					if (voter.choice === 'A') namesA.push(voter.name);
					else namesB.push(voter.name);
					if (vid === this.visitorId) myChoice = voter.choice;
				}
				this.voterNames = { A: namesA, B: namesB };
				this.myVote = myChoice;
			} else {
				this.voterNames = { A: [], B: [] };
				this.myVote = null;
			}
		});
		this.unsubscribers.push(() => off(this.roomRef));

		// Presence tracking
		const connectedRef = ref(db, '.info/connected');
		const connUnsub = onValue(connectedRef, (snap) => {
			if (snap.val() === true) {
				set(this.myPresenceRef, { name: this.userName || '', joinedAt: Date.now() });
				onDisconnect(this.myPresenceRef).remove();
			}
		});
		this.unsubscribers.push(() => off(connectedRef));

		// Listen to presence count and names
		const presUnsub = onValue(this.presenceRef, (snapshot) => {
			const presence = snapshot.val() as Record<string, { name: string; joinedAt: number }> | null;
			if (presence) {
				const entries = Object.values(presence);
				this.participantCount = entries.length;
				this.participants = entries.map((p) => ({ name: p.name }));
			} else {
				this.participantCount = 0;
				this.participants = [];
			}
		});
		this.unsubscribers.push(() => off(this.presenceRef));
	}

	async createRoom(questions: Question[]) {
		const roomData: RoomData = {
			questions,
			flippedIds: [],
			currentQuestionId: null,
			votingOpen: false,
			votes: { A: 0, B: 0 },
			voters: {},
			votingMode: 'binary'
		};
		await set(this.roomRef, roomData);
	}

	async flipCard(questionId: number) {
		const newFlippedIds = [...this.flippedIds, questionId];
		await update(this.roomRef, {
			flippedIds: newFlippedIds,
			currentQuestionId: questionId,
			votingOpen: true,
			votes: { A: 0, B: 0 },
			voters: {},
			spectrumVoters: null
		});
	}

	async vote(choice: 'A' | 'B') {
		if (this.myVote) return; // already voted
		const voterPath = `rooms/${this.roomId}/voters/${this.visitorId}`;
		await set(ref(db, voterPath), { choice, name: this.userName || '' });
		// Recalculate votes from voters
		const votersRef = ref(db, `rooms/${this.roomId}/voters`);
		onValue(
			votersRef,
			(snapshot) => {
				const voters = snapshot.val() as Record<string, { choice: 'A' | 'B'; name: string }> | null;
				if (!voters) return;
				const counts = { A: 0, B: 0 };
				for (const v of Object.values(voters)) {
					counts[v.choice]++;
				}
				update(this.roomRef, { votes: counts });
			},
			{ onlyOnce: true }
		);
	}

	async closeVoting() {
		await update(this.roomRef, {
			votingOpen: false,
			currentQuestionId: null
		});
	}

	async reset(questions: Question[]) {
		await update(this.roomRef, {
			questions,
			flippedIds: [],
			currentQuestionId: null,
			votingOpen: false,
			votes: { A: 0, B: 0 },
			voters: {},
			spectrumVoters: null
		});
	}

	async setVotingMode(mode: VotingMode) {
		await update(this.roomRef, { votingMode: mode });
	}

	voteSpectrum(value: number) {
		if (this.spectrumDebounceTimer) {
			clearTimeout(this.spectrumDebounceTimer);
		}
		this.spectrumDebounceTimer = setTimeout(() => {
			const voterPath = `rooms/${this.roomId}/spectrumVoters/${this.visitorId}`;
			set(ref(db, voterPath), { value, name: this.userName || '' });
		}, 150);
	}

	destroy() {
		for (const unsub of this.unsubscribers) {
			unsub();
		}
		this.unsubscribers = [];
	}
}
