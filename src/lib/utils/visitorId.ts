const STORAGE_KEY = 'eng-ultimate-choice-visitor-id';

export function getVisitorId(): string {
	if (typeof sessionStorage === 'undefined') return crypto.randomUUID();
	let id = sessionStorage.getItem(STORAGE_KEY);
	if (!id) {
		id = crypto.randomUUID();
		sessionStorage.setItem(STORAGE_KEY, id);
	}
	return id;
}
