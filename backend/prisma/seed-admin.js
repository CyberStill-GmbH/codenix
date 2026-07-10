import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const ADMIN_EMAIL = "cesar.guevara.s@uni.pe";
const ADMIN_PASSWORD = "AdminPassword123";
const ADMIN_NAME = "César Admin";
const ADMIN_USERNAME = "cesar-admin";
async function main() {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await prisma.user.upsert({
        where: {
            email: ADMIN_EMAIL
        },
        update: {
            passwordHash,
            role: "admin"
        },
        create: {
            name: ADMIN_NAME,
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            passwordHash,
            role: "admin"
        },
        select: {
            id: true,
            email: true,
            username: true,
            role: true
        }
    });
    console.log("Admin user ready:");
    console.log(admin);
    console.log("");
    console.log("Login credentials:");
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-admin.js.map