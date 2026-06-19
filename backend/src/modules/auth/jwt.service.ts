import { randomUUID } from "node:crypto";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";

type AccessTokenPayload = JwtPayload & {
  tokenType: "access";
};

export type VerifiedAccessToken = {
  userId: string;
  jwtId: string;
};

const accessTokenExpiresIn =
  env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;

export function signAccessToken(userId: string) {
  const payload: Pick<AccessTokenPayload, "tokenType"> = {
    tokenType: "access"
  };

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: accessTokenExpiresIn,
    issuer: env.JWT_ACCESS_ISSUER,
    audience: env.JWT_ACCESS_AUDIENCE,
    subject: userId,
    jwtid: randomUUID()
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): VerifiedAccessToken {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
      issuer: env.JWT_ACCESS_ISSUER,
      audience: env.JWT_ACCESS_AUDIENCE
    });

    if (typeof decoded === "string") {
      throw new AppError(401, "UNAUTHORIZED", "Invalid access token.");
    }

    const payload = decoded as AccessTokenPayload;

    if (payload.tokenType !== "access" || !payload.sub || !payload.jti) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid access token.");
    }

    return {
      userId: payload.sub,
      jwtId: payload.jti
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, "UNAUTHORIZED", "Invalid or expired access token.");
  }
}