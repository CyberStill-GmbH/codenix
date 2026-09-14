import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { notFoundHandler } from "../shared/middleware/not-found.middleware";
import { buildPaginationMeta, getPagination } from "../shared/utils/pagination";
import { createSlug } from "../shared/utils/slug";

describe("pagination utilities", () => {
  it("uses defaults when pagination values are omitted", () => {
    expect(getPagination()).toEqual({
      page: 1,
      pageSize: 10,
      skip: 0,
      take: 10,
    });
  });

  it("coerces query strings and calculates the database offset", () => {
    expect(getPagination("3", "25")).toEqual({
      page: 3,
      pageSize: 25,
      skip: 50,
      take: 25,
    });
  });

  it("clamps the page and page size to supported bounds", () => {
    expect(getPagination(0, 500)).toEqual({
      page: 1,
      pageSize: 100,
      skip: 0,
      take: 100,
    });
  });

  it("builds pagination metadata including a partial final page", () => {
    expect(buildPaginationMeta(2, 10, 21)).toEqual({
      page: 2,
      pageSize: 10,
      total: 21,
      totalPages: 3,
    });
  });
});

describe("slug utility", () => {
  it("normalizes casing, punctuation, and repeated separators", () => {
    expect(createSlug(`  John's "First" Problem!  `)).toBe(
      "johns-first-problem",
    );
  });

  it("removes leading and trailing separators", () => {
    expect(createSlug("---Codenix---")).toBe("codenix");
  });

  it("returns an empty slug when no alphanumeric characters remain", () => {
    expect(createSlug("?!")).toBe("");
  });
});

describe("not-found middleware", () => {
  it("returns a route-specific 404 response", () => {
    const request = {
      method: "GET",
      originalUrl: "/api/missing",
    } as Request;
    const response = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    notFoundHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      code: "NOT_FOUND",
      message: "Route GET /api/missing not found.",
    });
  });
});
