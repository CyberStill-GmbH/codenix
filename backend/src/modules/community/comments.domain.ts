export type VoteType = "up" | "down";

export function toggleVote(current: VoteType | null, next: VoteType) {
  return current === next ? null : next;
}

export function calculateReputation(upvotes: number, downvotes: number) {
  return Math.max(0, upvotes - downvotes);
}
