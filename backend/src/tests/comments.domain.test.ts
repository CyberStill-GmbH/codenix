import { describe, expect, it } from "vitest";
import { calculateReputation, canVoteOnComment, toggleVote } from "../modules/community/comments.domain";

describe("comment vote rules", () => {
  it("adds a vote when the user has not voted", () => {
    expect(toggleVote(null, "up")).toBe("up");
  });

  it("removes the vote when the same control is pressed again", () => {
    expect(toggleVote("up", "up")).toBeNull();
  });

  it("switches direction without allowing two votes", () => {
    expect(toggleVote("up", "down")).toBe("down");
  });
});

describe("comment reputation", () => {
  it("uses one point per upvote and subtracts downvotes", () => {
    expect(calculateReputation(8, 3)).toBe(5);
  });

  it("never drops below zero", () => {
    expect(calculateReputation(1, 4)).toBe(0);
  });
});

describe("comment ownership", () => {
  it("prevents an author from voting on their own comment", () => {
    expect(canVoteOnComment("user-1", "user-1")).toBe(false);
    expect(canVoteOnComment("user-1", "user-2")).toBe(true);
  });
});
