import { ref, onValue, set, update, onDisconnect, off } from 'firebase/database';
import { db } from './config';
import type { Question } from '$lib/data/questions';
import type { RoomData } from '$lib/types/room';
import { getVisitorId } from '$lib/utils/visitorId';

export class RoomState {
	roomId: string;
	visitorId: string;

	questions = $state<Question[]>([]);
	flippedIds = $state<number[]>([]);
	currentQuestionId = $state<number | null>(null);
	votingOpen = $state(false);
	votes = $state<{ A: number; B: number }>({ A: 0, B: 0 });
	participantCount = $state(0);
	participants = $state<{ name: string }[]>([]);
	myVote = $state<'A' | 'B' | null>(null);
	connected = $state(false);

	private userName?: string;
	private roomRef;
	private presenceRef;
	private myPresenceRef;
	private unsubscribers: (() => void)[] = [];

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
			this.connected = true;

			// Check if this visitor already voted
			if (data.voters && data.voters[this.visitorId]) {
				this.myVote = data.voters[this.visitorId];
			} else {
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
			voters: {}
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
			voters: {}
		});
	}

	async vote(choice: 'A' | 'B') {
		if (this.myVote) return; // already voted
		const voterPath = `rooms/${this.roomId}/voters/${this.visitorId}`;
		await set(ref(db, voterPath), choice);
		// Recalculate votes from voters
		const votersRef = ref(db, `rooms/${this.roomId}/voters`);
		onValue(
			votersRef,
			(snapshot) => {
				const voters = snapshot.val() as Record<string, 'A' | 'B'> | null;
				if (!voters) return;
				const counts = { A: 0, B: 0 };
				for (const v of Object.values(voters)) {
					counts[v]++;
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
			voters: {}
		});
	}

	destroy() {
		for (const unsub of this.unsubscribers) {
			unsub();
		}
		this.unsubscribers = [];
	}
}
