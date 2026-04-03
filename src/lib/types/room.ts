import type { Question } from '$lib/data/questions';

export type VotingMode = 'binary' | 'spectrum';
export type SpectrumVoter = { value: number; name: string };

export type RoomData = {
	questions: Question[];
	flippedIds: number[];
	currentQuestionId: number | null;
	votingOpen: boolean;
	votes: { A: number; B: number };
	voters: Record<string, { choice: 'A' | 'B'; name: string }>;
	votingMode: VotingMode;
	spectrumVoters?: Record<string, SpectrumVoter>;
};

export type PresenceData = {
	name: string;
	joinedAt: number;
};
