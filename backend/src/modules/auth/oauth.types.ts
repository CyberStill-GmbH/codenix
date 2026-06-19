import type { OAuthProvider } from "../../generated/prisma/client";

export type SupportedOAuthProvider = Extract<OAuthProvider, "google" | "github">;

export type OAuthProviderConfig = {
  provider: SupportedOAuthProvider;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
};

export type OAuthStatePayload = {
  provider: SupportedOAuthProvider;
  nonce: string;
  returnTo?: string;
  createdAt: number;
};

export type OAuthTokenResponse = {
  access_token: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
};

export type OAuthProfile = {
  provider: SupportedOAuthProvider;
  providerAccountId: string;
  email?: string;
  emailVerified?: boolean;
  username?: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
};