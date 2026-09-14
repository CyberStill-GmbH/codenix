import { describe, expect, it } from "vitest";
import { hasValidImageSignature } from "../modules/community/comment-uploads.middleware";

describe("comment image uploads", () => {
  it("requires an image signature that matches the declared format", () => {
    expect(hasValidImageSignature({ buffer: Buffer.from([0xff, 0xd8, 0xff, 0x00]) } as Express.Multer.File)).toBe(true);
    expect(hasValidImageSignature({ buffer: Buffer.from("not-an-image") } as Express.Multer.File)).toBe(false);
  });
});
