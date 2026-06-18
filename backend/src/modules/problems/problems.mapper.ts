import type { Prisma } from "../../generated/prisma/client";

type ProblemListItemModel = Prisma.ProblemGetPayload<{
  include: {
    topics: {
      include: {
        topic: true;
      };
    };
  };
}>;

type ProblemDetailModel = Prisma.ProblemGetPayload<{
  include: {
    topics: {
      include: {
        topic: true;
      };
    };
    examples: true;
    codeTemplates: true;
  };
}>;

function mapTopics(problem: ProblemListItemModel | ProblemDetailModel) {
  return problem.topics.map((item) => item.topic.name);
}

export function toProblemListItem(problem: ProblemListItemModel) {
  return {
    id: problem.id,
    numericId: problem.numericId,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    acceptance: problem.acceptance,
    solved: false,
    topics: mapTopics(problem)
  };
}

export function toProblemDetail(problem: ProblemDetailModel) {
  return {
    id: problem.id,
    numericId: problem.numericId,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    acceptance: problem.acceptance,
    solved: false,
    topics: mapTopics(problem),
    statement: problem.statement,
    inputFormat: problem.inputFormat,
    outputFormat: problem.outputFormat,
    constraints: problem.constraints,
    examples: problem.examples.map((example) => ({
      id: example.id,
      input: example.input,
      output: example.output,
      explanation: example.explanation
    })),
    codeTemplates: problem.codeTemplates.map((template) => ({
      language: template.language,
      starterCode: template.starterCode
    }))
  };
}

export function toProblemTopicItem(topic: {
  id: string;
  name: string;
  slug: string;
}) {
  return {
    id: topic.id,
    name: topic.name,
    slug: topic.slug
  };
}