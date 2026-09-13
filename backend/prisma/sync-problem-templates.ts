import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { SUPPORTED_JUDGE_LANGUAGES } from "../src/modules/judge/supported-languages";
import { PROBLEM_CATALOG } from "./problem-catalog";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

async function main() {
  const slugs = PROBLEM_CATALOG.map((problem) => problem.slug);
  const problems = await prisma.problem.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true }
  });
  const problemIds = problems.map((problem) => problem.id);
  const seeds = new Map(PROBLEM_CATALOG.map((problem) => [problem.slug, problem]));

  await prisma.$transaction(async (tx) => {
    await tx.problemCodeTemplate.deleteMany({
      where: { problemId: { in: problemIds } }
    });
    await tx.problemCodeTemplate.createMany({
      data: problems.flatMap((problem) => {
        const seed = seeds.get(problem.slug);
        if (!seed) return [];
        return SUPPORTED_JUDGE_LANGUAGES.map((language) => ({
          problemId: problem.id,
          language,
          starterCode: seed.starterCode[language]
        }));
      })
    });
  });

  console.log(`Synchronized templates for ${problems.length} catalog problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
