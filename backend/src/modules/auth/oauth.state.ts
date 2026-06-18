import {
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";
import type {
  OAuthStatePayload,
  SupportedOAuthProvider
} from "./oauth.types";

const STATE_TTL_MS = 10 * 60 * 1000;

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signStatePayload(encodedPayload: string) {
  return createHmac("sha256", env.JWT_ACCESS_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function normalizeReturnTo(returnTo?: string) {
  if (!returnTo) {
    return undefined;
  }

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return undefined;
  }

  return returnTo;
}

export function createOAuthState(
  provider: SupportedOAuthProvider,
  returnTo?: string
) {
  const normalizedReturnTo = normalizeReturnTo(returnTo);

  const payload: OAuthStatePayload = {
  provider,
  nonce: randomBytes(24).toString("base64url"),
  createdAt: Date.now(),
  ...(normalizedReturnTo ? { returnTo: normalizedReturnTo } : {})
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signStatePayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyOAuthState(
  state: string,
  expectedProvider: SupportedOAuthProvider
) {
  const [encodedPayload, signature] = state.split(".");

  if (!encodedPayload || !signature) {
    throw new AppError(400, "INVALID_OAUTH_STATE", "Invalid OAuth state.");
  }

  const expectedSignature = signStatePayload(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    throw new AppError(400, "INVALID_OAUTH_STATE", "Invalid OAuth state.");
  }

  let payload: OAuthStatePayload;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as OAuthStatePayload;
  } catch {
    throw new AppError(400, "INVALID_OAUTH_STATE", "Invalid OAuth state.");
  }

  if (payload.provider !== expectedProvider) {
    throw new AppError(400, "INVALID_OAUTH_STATE", "Invalid OAuth provider.");
  }

  if (!payload.nonce || typeof payload.createdAt !== "number") {
    throw new AppError(400, "INVALID_OAUTH_STATE", "Invalid OAuth state.");
  }

  const isExpired = Date.now() - payload.createdAt > STATE_TTL_MS;

  if (isExpired) {
    throw new AppError(400, "EXPIRED_OAUTH_STATE", "OAuth state expired.");
  }

  return {
    provider: payload.provider,
    returnTo: normalizeReturnTo(payload.returnTo)
  };
}