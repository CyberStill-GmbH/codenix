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
  const numericIds = PROBLEM_CATALOG.map((problem) => problem.numericId);
  const problems = await prisma.problem.findMany({
    where: { numericId: { in: numericIds } },
    select: { id: true, numericId: true }
  });
  const problemIds = problems.map((problem) => problem.id);
  const seeds = new Map(PROBLEM_CATALOG.map((problem) => [problem.numericId, problem]));

  await prisma.$transaction(async (tx) => {
    await tx.problemCodeTemplate.deleteMany({
      where: { problemId: { in: problemIds } }
    });
    await tx.problemCodeTemplate.createMany({
      data: problems.flatMap((problem) => {
        const seed = seeds.get(problem.numericId);
        if (!seed) return [];
        return SUPPORTED_JUDGE_LANGUAGES.map((language) => ({
          problemId: problem.id,
          language,
          starterCode: seed.starterCode[language]
        }));
      })
    });

    const rows = problems.flatMap((problem) => {
      const seed = seeds.get(problem.numericId);
      return seed ? [{ problem, seed }] : [];
    });
    const values = rows
      .map((_, index) => {
        const offset = index * 10;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}::\"ProblemDifficulty\", $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}::jsonb, $${offset + 10})`;
      })
      .join(",");
    const parameters = rows.flatMap(({ seed }) => [
      seed.numericId,
      seed.slug,
      seed.title,
      seed.difficulty,
      seed.statement,
      seed.inputFormat,
      seed.outputFormat,
      seed.constraints,
      JSON.stringify(seed.parameters),
      seed.outputType
    ]);
    await tx.$executeRawUnsafe(
      `UPDATE \"problems\" AS p
       SET \"slug\" = v.slug,
           \"title\" = v.title,
           \"difficulty\" = v.difficulty,
           \"statement\" = v.statement,
           \"inputFormat\" = v.input_format,
           \"outputFormat\" = v.output_format,
           \"constraints\" = v.constraints,
           \"parameters\" = v.parameters,
           \"outputType\" = v.output_type
       FROM (VALUES ${values}) AS v(numeric_id, slug, title, difficulty, statement, input_format, output_format, constraints, parameters, output_type)
       WHERE p.\"numericId\" = v.numeric_id`,
      ...parameters
    );
  });

  console.log(`Synchronized templates for ${problems.length} catalog problems.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
