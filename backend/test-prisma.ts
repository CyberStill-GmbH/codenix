import "dotenv/config";
import { prisma } from './src/db/prisma';

async function main() {
  try {
    const res = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'github',
          providerAccountId: '123'
        }
      }
    });
    console.log("Success, query returned:", res);
  } catch (err) {
    console.error("Query failed with error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
