import type { 
    Prisma,
    TestcaseVisibility 
} from "../../../generated/prisma/client";
import { prisma } from "../../../db/prisma";
import { AppError } from "../../../shared/errors/app-error";
import {
  isSupportedJudgeLanguage,
  SUPPORTED_JUDGE_LANGUAGES
} from "../../judge/supported-languages";
import {
  toAdminLegacyTestcaseItem,
  toAdminProblemDetails,
  toAdminProblemListItem
} from "./admin-problems.mapper";
import type {
  AdminTestcaseBodyInput,
  AdminProblemBodyInput,
  AdminProblemsQueryInput
} from "./admin-problems.schema";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function serialize(value: unknown) {
  return JSON.stringify(value);
}

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

async function upsertTopic(name: string) {
  const slug = slugify(name);

  return prisma.topic.upsert({
    where: {
      slug
    },
    update: {
      name
    },
    create: {
      name,
      slug
    }
  });
}

async function getNextNumericId() {
  const lastProblem = await prisma.problem.findFirst({
    orderBy: {
      numericId: "desc"
    },
    select: {
      numericId: true
    }
  });

  return (lastProblem?.numericId ?? 0) + 1;
}

function buildWhere(query: AdminProblemsQueryInput): Prisma.ProblemWhereInput {
  const where: Prisma.ProblemWhereInput = {};

  if (query.difficulty) {
    where.difficulty = query.difficulty;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        slug: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }

  if (query.tag) {
    where.topics = {
      some: {
        topic: {
          slug: slugify(query.tag)
        }
      }
    };
  }

  return where;
}

function buildOrderBy(
  sort: AdminProblemsQueryInput["sort"]
): Prisma.ProblemOrderByWithRelationInput {
  if (sort === "updated-asc") {
    return {
      updatedAt: "asc"
    };
  }

  if (sort === "title-asc") {
    return {
      title: "asc"
    };
  }

  return {
    updatedAt: "desc"
  };
}

function buildExamples(input: AdminProblemBodyInput) {
  return input.examples.map((example) => ({
    input: example.input,
    output: example.output,
    ...(example.explanation ? { explanation: example.explanation } : {})
  }));
}

function buildCodeTemplates(input: AdminProblemBodyInput) {
  return input.supported_languages.map((language) => ({
    language,
    starterCode: input.starter_code[language] ?? ""
  }));
}

function validateSupportedLanguages(input: AdminProblemBodyInput) {
  const unsupportedLanguages = input.supported_languages.filter(
    (language) => !isSupportedJudgeLanguage(language)
  );

  if (unsupportedLanguages.length === 0) return;

  throw new AppError(
    422,
    "UNSUPPORTED_LANGUAGE",
    "One or more languages do not have an available judge runner.",
    {
      unsupportedLanguages,
      supportedLanguages: [...SUPPORTED_JUDGE_LANGUAGES]
    }
  );
}

function buildTestcases(input: AdminProblemBodyInput) {
  return input.testcases.map((testcase, index) => {
    const visibility: TestcaseVisibility = testcase.is_sample
      ? "sample"
      : "hidden";

    return {
      input: serialize(testcase.input),
      expectedOutput: serialize(testcase.expected_output),
      visibility,
      weight: testcase.weight,
      orderIndex: index + 1
    };
  });
}

async function buildProblemTopics(input: AdminProblemBodyInput) {
  const uniqueTags = [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))];

  const topics = await Promise.all(uniqueTags.map((tag) => upsertTopic(tag)));

  return topics.map((topic) => ({
    topicId: topic.id
  }));
}

async function findProblemOrThrow(identifier: string) {
  const problem = await prisma.problem.findFirst({
    where: {
      OR: [
        {
          id: identifier
        },
        {
          slug: identifier
        }
      ]
    },
    select: {
      id: true
    }
  });

  if (!problem) {
    throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
  }

  return problem;
}

async function findAdminProblemDetails(identifier: string) {
  const problem = await prisma.problem.findFirst({
    where: {
      OR: [
        {
          id: identifier
        },
        {
          slug: identifier
        }
      ]
    },
    include: {
      topics: {
        include: {
          topic: true
        }
      },
      examples: true,
      codeTemplates: true,
      testcases: true,
      _count: {
        select: {
          testcases: true
        }
      }
    }
  });

  if (!problem) {
    throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
  }

  return toAdminProblemDetails(problem);
}

async function validatePublishable(problemId: string) {
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId
    },
    include: {
      testcases: true,
      codeTemplates: true
    }
  });

  if (!problem) {
    throw new AppError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
  }

  const hasSample = problem.testcases.some(
    (testcase) => testcase.visibility === "sample"
  );

  const hasLanguage = problem.codeTemplates.length > 0;
  const missing: string[] = [];

  if (!hasSample) {
    missing.push("sampleTestcases");
  }

  if (problem.testcases.length === 0) {
    missing.push("testcases");
  }

  if (!hasLanguage) {
    missing.push("languages");
  }

  for (const template of problem.codeTemplates) {
    if (!isSupportedJudgeLanguage(template.language)) {
      missing.push(`runners.${template.language}`);
    }

    if (!template.starterCode.trim()) {
      missing.push(`templates.${template.language}`);
    }
  }

  if (missing.length > 0) {
    throw new AppError(422, "INCOMPLETE_PROBLEM", "Problem cannot be published.", {
      missing
    });
  }
}

async function getNextTestcaseOrderIndex(problemId: string) {
  const aggregate = await prisma.testcase.aggregate({
    where: {
      problemId
    },
    _max: {
      orderIndex: true
    }
  });

  return (aggregate._max.orderIndex ?? 0) + 1;
}

async function findTestcaseOrThrow(problemId: string, testcaseId: string) {
  const testcase = await prisma.testcase.findFirst({
    where: {
      id: testcaseId,
      problemId
    },
    select: {
      id: true
    }
  });

  if (!testcase) {
    throw new AppError(404, "TESTCASE_NOT_FOUND", "Testcase not found.");
  }

  return testcase;
}

export const adminProblemsService = {
  async list(query: AdminProblemsQueryInput) {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);

    

    const [problems, total] = await prisma.$transaction([
      prisma.problem.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          topics: {
            include: {
              topic: true
            }
          },
          _count: {
            select: {
              testcases: true
            }
          }
        }
      }),

      prisma.problem.count({
        where
      })
    ]);

    return {
      data: problems.map(toAdminProblemListItem),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  },

  async findByIdentifier(identifier: string) {
    return findAdminProblemDetails(identifier);
  },

  async create(input: AdminProblemBodyInput) {
    validateSupportedLanguages(input);
    const numericId = await getNextNumericId();
    const topics = await buildProblemTopics(input);

    try {
      const problem = await prisma.problem.create({
        data: {
          numericId,
          title: input.title,
          slug: input.slug,
          difficulty: input.difficulty,
          acceptance: 0,
          status: input.status === "published" ? "draft" : input.status,
          statement: input.description_markdown,
          inputFormat: input.parameters
            .map((parameter) => `${parameter.name}: ${parameter.type}`)
            .join("\n"),
          outputFormat: input.output_type,
          constraints: input.constraints.join("\n"),
          parameters: input.parameters as Prisma.InputJsonValue,
          outputType: input.output_type,
          timeLimitMs: input.time_limit_ms,
          memoryLimitMb: input.memory_limit_mb,
          examples: {
            create: buildExamples(input)
          },
          codeTemplates: {
            create: buildCodeTemplates(input)
          },
          topics: {
            create: topics
          },
          testcases: {
            create: buildTestcases(input)
          }
        },
        select: {
          id: true
        }
      });

      if (input.status === "published") {
        await validatePublishable(problem.id);
        await prisma.problem.update({
          where: { id: problem.id },
          data: { status: "published" }
        });
      }

      return findAdminProblemDetails(problem.id);
    } catch (error) {
      if (isPrismaUniqueError(error)) {
        throw new AppError(409, "SLUG_ALREADY_EXISTS", "Slug already exists.");
      }

      throw error;
    }
  },

  async update(identifier: string, input: AdminProblemBodyInput) {
    validateSupportedLanguages(input);
    const existingProblem = await findProblemOrThrow(identifier);
    const topics = await buildProblemTopics(input);

    try {
      await prisma.problem.update({
        where: {
          id: existingProblem.id
        },
        data: {
          title: input.title,
          slug: input.slug,
          difficulty: input.difficulty,
          status: input.status === "published" ? "draft" : input.status,
          statement: input.description_markdown,
          inputFormat: input.parameters
            .map((parameter) => `${parameter.name}: ${parameter.type}`)
            .join("\n"),
          outputFormat: input.output_type,
          constraints: input.constraints.join("\n"),
          parameters: input.parameters as Prisma.InputJsonValue,
          outputType: input.output_type,
          timeLimitMs: input.time_limit_ms,
          memoryLimitMb: input.memory_limit_mb,
          examples: {
            deleteMany: {},
            create: buildExamples(input)
          },
          codeTemplates: {
            deleteMany: {},
            create: buildCodeTemplates(input)
          },
          topics: {
            deleteMany: {},
            create: topics
          },
          testcases: {
            deleteMany: {},
            create: buildTestcases(input)
          }
        }
      });

      if (input.status === "published") {
        await validatePublishable(existingProblem.id);
        await prisma.problem.update({
          where: { id: existingProblem.id },
          data: { status: "published" }
        });
      }

      return findAdminProblemDetails(existingProblem.id);
    } catch (error) {
      if (isPrismaUniqueError(error)) {
        throw new AppError(409, "SLUG_ALREADY_EXISTS", "Slug already exists.");
      }

      throw error;
    }
  },

  async publish(identifier: string) {
    const problem = await findProblemOrThrow(identifier);

    await validatePublishable(problem.id);

    const updatedProblem = await prisma.problem.update({
      where: {
        id: problem.id
      },
      data: {
        status: "published"
      },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    });

    return {
      id: updatedProblem.id,
      status: updatedProblem.status,
      updatedAt: updatedProblem.updatedAt.toISOString()
    };
  },

  async unpublish(identifier: string) {
    const problem = await findProblemOrThrow(identifier);

    const updatedProblem = await prisma.problem.update({
      where: {
        id: problem.id
      },
      data: {
        status: "draft"
      },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    });

    return {
      id: updatedProblem.id,
      status: updatedProblem.status,
      updatedAt: updatedProblem.updatedAt.toISOString()
    };
  },

  async listTestcases(identifier: string) {
    const problem = await findProblemOrThrow(identifier);

    const testcases = await prisma.testcase.findMany({
        where: {
        problemId: problem.id
        },
        orderBy: {
        orderIndex: "asc"
        }
    });

    return {
        data: testcases.map(toAdminLegacyTestcaseItem)
    };
    },

    async createTestcase(identifier: string, input: AdminTestcaseBodyInput) {
    const problem = await findProblemOrThrow(identifier);
    const orderIndex = await getNextTestcaseOrderIndex(problem.id);

    const testcase = await prisma.testcase.create({
        data: {
        problemId: problem.id,
        input: input.input,
        expectedOutput: input.expectedOutput,
        visibility: input.visibility,
        weight: input.weight,
        orderIndex
        }
    });

    return toAdminLegacyTestcaseItem(testcase);
    },

    async updateTestcase(
    identifier: string,
    testcaseId: string,
    input: AdminTestcaseBodyInput
    ) {
    const problem = await findProblemOrThrow(identifier);
    const testcase = await findTestcaseOrThrow(problem.id, testcaseId);

    const updatedTestcase = await prisma.testcase.update({
        where: {
        id: testcase.id
        },
        data: {
        input: input.input,
        expectedOutput: input.expectedOutput,
        visibility: input.visibility,
        weight: input.weight
        }
    });

    return toAdminLegacyTestcaseItem(updatedTestcase);
    },

    async deleteTestcase(identifier: string, testcaseId: string) {
    const problem = await findProblemOrThrow(identifier);
    const testcase = await findTestcaseOrThrow(problem.id, testcaseId);

    await prisma.testcase.delete({
        where: {
        id: testcase.id
        }
    });
    }
};
