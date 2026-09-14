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

  it("accepts only server-owned comment image paths", () => {
    expect(createCommentSchema.safeParse({ content: "Mira esto", imageUrl: "/uploads/images/comments/123e4567-e89b-12d3-a456-426614174000.webp" }).success).toBe(true);
    expect(createCommentSchema.safeParse({ content: "remote", imageUrl: "https://example.com/image.png" }).success).toBe(false);
    expect(createCommentSchema.safeParse({ content: "svg", imageUrl: "/uploads/images/comments/123e4567-e89b-12d3-a456-426614174000.svg" }).success).toBe(false);
  });
});
