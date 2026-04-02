import type { Question } from '$lib/data/questions';

export type RoomData = {
	questions: Question[];
	flippedIds: number[];
	currentQuestionId: number | null;
	votingOpen: boolean;
	votes: { A: number; B: number };
	voters: Record<string, 'A' | 'B'>;
};

export type PresenceData = {
	visitorId: string;
	joinedAt: number;
};
