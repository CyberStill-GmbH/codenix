import type { Prisma, SubmissionResult } from "../../generated/prisma/client";

type SubmissionListItemModel = Prisma.SubmissionGetPayload<{
  include: {
    problem: {
      include: {
        topics: {
          include: {
            topic: true;
          };
        };
      };
    };
  };
}>;

const resultLabels: Record<SubmissionResult, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  time_limit_exceeded: "Time Limit Exceeded",
  compilation_error: "Compilation Error",
  pending: "Pending"
};

function mapTopics(submission: SubmissionListItemModel) {
  return submission.problem.topics.map((item) => item.topic.name);
}

export function toSubmissionListItem(submission: SubmissionListItemModel) {
  return {
    id: submission.id,
    problemId: submission.problemId,
    problemTitle: submission.problem.title,
    problemSlug: submission.problem.slug,
    difficulty: submission.problem.difficulty,
    result: resultLabels[submission.result],
    language: submission.language,
    submittedAt: submission.submittedAt.toISOString(),
    executionTimeMs: submission.executionTimeMs,
    memoryKb: submission.memoryKb,
    submissionsCount: 1,
    acceptance: submission.problem.acceptance,
    topics: mapTopics(submission)
  };
}