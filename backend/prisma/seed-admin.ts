import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { z } from "zod";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const adminSeedEnvSchema = z.object({
  ADMIN_EMAIL: z.string().trim().email(),
  ADMIN_PASSWORD: z.string().min(12).max(72),
  ADMIN_NAME: z.string().trim().min(2).max(80).default("Codenix Admin"),
  ADMIN_USERNAME: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_-]+$/)
    .default("admin"),
});

const adminSeedEnv = adminSeedEnvSchema.safeParse(process.env);

if (!adminSeedEnv.success) {
  const errors = adminSeedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid admin seed configuration: ${errors}`);
}

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_USERNAME } =
  adminSeedEnv.data;

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },
    update: {
      passwordHash,
      role: "admin",
    },
    create: {
      name: ADMIN_NAME,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  console.log("Admin user ready:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
