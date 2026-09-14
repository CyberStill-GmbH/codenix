import { describe, expect, it } from "vitest";
import { commentListQuerySchema, createCommentSchema, voteCommentSchema } from "../modules/community/comments.schema";

describe("comments API contracts", () => {
  it("defaults to a bounded best-first page", () => {
    expect(commentListQuerySchema.parse({})).toEqual({ sort: "best", limit: 20 });
  });

  it("rejects empty comments and invalid votes", () => {
    expect(createCommentSchema.safeParse({ content: "   " }).success).toBe(false);
    expect(voteCommentSchema.safeParse({ vote: "sideways" }).success).toBe(false);
  });

  it("accepts a reply parent id", () => {
    const result = createCommentSchema.safeParse({
      content: "Una explicación útil.",
      parentId: "11111111-1111-4111-8111-111111111111",
    });
    expect(result.success).toBe(true);
  });
});
