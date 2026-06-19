import type { User } from "../../generated/prisma/client";

type DbUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  degree: string;
  githubUrl: string;
  linkedinUrl: string;
  role: "user" | "admin";
  createdAt: Date;
};

export function toAuthUser(user: DbUser) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    degree: user.degree,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    memberSince: user.createdAt.toISOString(),
    role: user.role
  };
}
