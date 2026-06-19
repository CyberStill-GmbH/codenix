import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertTopic(name: string) {
  const slug = slugify(name);

  return prisma.topic.upsert({
    where: { slug },
    update: {
      name
    },
    create: {
      name,
      slug
    }
  });
}

async function main() {
  const arrayTopic = await upsertTopic("Array");
  const hashTableTopic = await upsertTopic("Hash Table");
  const stringTopic = await upsertTopic("String");
  const stackTopic = await upsertTopic("Stack");
  const mathTopic = await upsertTopic("Math");
  const dynamicProgrammingTopic = await upsertTopic("Dynamic Programming");
  const recursionTopic = await upsertTopic("Recursion");

  await prisma.problem.upsert({
    where: { slug: "two-sum" },
    update: {},
    create: {
      numericId: 1,
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "easy",
      acceptance: 52.4,
      status: "published",
      statement:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      inputFormat:
        "The first line contains an array nums. The second line contains an integer target.",
      outputFormat: "Return two indices whose values add up to target.",
      constraints:
        "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
      examples: {
        create: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9."
          }
        ]
      },
      codeTemplates: {
        create: [
          {
            language: "python",
            starterCode:
              "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass\n"
          },
          {
            language: "javascript",
            starterCode:
              "function twoSum(nums, target) {\n  // Write your solution here\n}\n"
          },
          {
            language: "typescript",
            starterCode:
              "function twoSum(nums: number[], target: number): number[] {\n  // Write your solution here\n}\n"
          },
          {
            language: "java",
            starterCode:
              "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}\n"
          }
        ]
      },
      topics: {
        create: [
          { topicId: arrayTopic.id },
          { topicId: hashTableTopic.id }
        ]
      },
      testcases: {
        create: [
          {
            input: "[2,7,11,15]\n9",
            expectedOutput: "[0,1]",
            visibility: "sample",
            weight: 1,
            orderIndex: 1
          },
          {
            input: "[3,2,4]\n6",
            expectedOutput: "[1,2]",
            visibility: "hidden",
            weight: 1,
            orderIndex: 2
          }
        ]
      }
    }
  });

  await prisma.problem.upsert({
    where: { slug: "valid-parentheses" },
    update: {},
    create: {
      numericId: 2,
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "easy",
      acceptance: 44.1,
      status: "published",
      statement:
        "Given a string s containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      inputFormat: "The first line contains a string s.",
      outputFormat: "Return true if the string is valid, otherwise false.",
      constraints:
        "1 <= s.length <= 10^4\ns consists of parentheses only: '(', ')', '{', '}', '[' and ']'.",
      examples: {
        create: [
          {
            input: 's = "()"',
            output: "true",
            explanation: "The parentheses close in the correct order."
          }
        ]
      },
      codeTemplates: {
        create: [
          {
            language: "python",
            starterCode:
              "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass\n"
          },
          {
            language: "javascript",
            starterCode:
              "function isValid(s) {\n  // Write your solution here\n}\n"
          },
          {
            language: "typescript",
            starterCode:
              "function isValid(s: string): boolean {\n  // Write your solution here\n}\n"
          },
          {
            language: "java",
            starterCode:
              "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}\n"
          }
        ]
      },
      topics: {
        create: [
          { topicId: stringTopic.id },
          { topicId: stackTopic.id }
        ]
      },
      testcases: {
        create: [
          {
            input: "()",
            expectedOutput: "true",
            visibility: "sample",
            weight: 1,
            orderIndex: 1
          },
          {
            input: "([)]",
            expectedOutput: "false",
            visibility: "hidden",
            weight: 1,
            orderIndex: 2
          }
        ]
      }
    }
  });

  await prisma.problem.upsert({
    where: { slug: "fibonacci-number" },
    update: {},
    create: {
      numericId: 3,
      title: "Fibonacci Number",
      slug: "fibonacci-number",
      difficulty: "easy",
      acceptance: 70.8,
      status: "published",
      statement:
        "Given n, calculate F(n), where F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2).",
      inputFormat: "The first line contains an integer n.",
      outputFormat: "Return F(n).",
      constraints: "0 <= n <= 30",
      examples: {
        create: [
          {
            input: "n = 4",
            output: "3",
            explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3."
          }
        ]
      },
      codeTemplates: {
        create: [
          {
            language: "python",
            starterCode:
              "class Solution:\n    def fib(self, n: int) -> int:\n        pass\n"
          },
          {
            language: "javascript",
            starterCode:
              "function fib(n) {\n  // Write your solution here\n}\n"
          },
          {
            language: "typescript",
            starterCode:
              "function fib(n: number): number {\n  // Write your solution here\n}\n"
          },
          {
            language: "java",
            starterCode:
              "class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}\n"
          }
        ]
      },
      topics: {
        create: [
          { topicId: mathTopic.id },
          { topicId: dynamicProgrammingTopic.id },
          { topicId: recursionTopic.id }
        ]
      },
      testcases: {
        create: [
          {
            input: "4",
            expectedOutput: "3",
            visibility: "sample",
            weight: 1,
            orderIndex: 1
          },
          {
            input: "10",
            expectedOutput: "55",
            visibility: "hidden",
            weight: 1,
            orderIndex: 2
          }
        ]
      }
    }
  });

  console.log("Seeded problems successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });