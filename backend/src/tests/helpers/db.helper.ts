import { prisma } from "../../db/prisma";

export async function cleanDatabase() {
  await prisma.codeRunTestcaseResult.deleteMany();
  await prisma.codeRun.deleteMany();
  await prisma.submissionTestcaseResult.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.testcase.deleteMany();
  await prisma.problemCodeTemplate.deleteMany();
  await prisma.problemExample.deleteMany();
  await prisma.problemTopic.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();
}
