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
async function main() {
    console.log("Seeding Codenix database...");
    await prisma.submissionTestcaseResult.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.testcase.deleteMany();
    await prisma.problemCodeTemplate.deleteMany();
    await prisma.problemExample.deleteMany();
    await prisma.problemTopic.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.problem.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash("Password123", 10);
    const admin = await prisma.user.create({
        data: {
            name: "Codenix Admin",
            username: "admin",
            email: "admin@codenix.dev",
            passwordHash,
            role: "admin",
            avatarUrl: "",
            degree: "Cybersecurity Engineering",
            githubUrl: "https://github.com/CyberStill-GmbH",
            linkedinUrl: ""
        }
    });
    const user = await prisma.user.create({
        data: {
            name: "Cesar Guevara",
            username: "cesar",
            email: "user@codenix.dev",
            passwordHash,
            role: "user",
            avatarUrl: "",
            degree: "Cybersecurity Engineering",
            githubUrl: "https://github.com/CyberStill-GmbH",
            linkedinUrl: ""
        }
    });
    const topicNames = [
        "Array",
        "Hash Table",
        "Two Pointers",
        "Binary Search",
        "Dynamic Programming",
        "Graph",
        "Stack",
        "Queue",
        "String",
        "Greedy"
    ];
    const topics = new Map();
    for (const name of topicNames) {
        const topic = await prisma.topic.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
            }
        });
        topics.set(name, topic.id);
    }
    const problemsData = [
        {
            title: "Two Sum",
            slug: "two-sum",
            difficulty: "easy",
            status: "published",
            acceptance: 52.4,
            topics: ["Array", "Hash Table"],
            statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            inputFormat: "The first line contains an integer n. The second line contains n integers. The third line contains target.",
            outputFormat: "Print two indices separated by a space.",
            constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
            examples: [
                {
                    input: "4\n2 7 11 15\n9",
                    output: "0 1",
                    explanation: "nums[0] + nums[1] = 2 + 7 = 9."
                }
            ]
        },
        {
            title: "Valid Parentheses",
            slug: "valid-parentheses",
            difficulty: "easy",
            status: "published",
            acceptance: 41.8,
            topics: ["Stack", "String"],
            statement: "Given a string containing only parentheses characters, determine if the input string is valid.",
            inputFormat: "The first line contains a string s.",
            outputFormat: "Print true if the string is valid, otherwise false.",
            constraints: "1 <= s.length <= 10^4\ns consists only of parentheses characters.",
            examples: [
                {
                    input: "()[]{}",
                    output: "true",
                    explanation: "All brackets are closed in the correct order."
                }
            ]
        },
        {
            title: "Binary Search",
            slug: "binary-search",
            difficulty: "easy",
            status: "published",
            acceptance: 58.1,
            topics: ["Array", "Binary Search"],
            statement: "Given a sorted array of integers and a target value, return the index if the target is found. Otherwise, return -1.",
            inputFormat: "The first line contains n. The second line contains n sorted integers. The third line contains target.",
            outputFormat: "Print the index of target or -1.",
            constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i], target <= 10^9",
            examples: [
                {
                    input: "6\n-1 0 3 5 9 12\n9",
                    output: "4",
                    explanation: "9 exists at index 4."
                }
            ]
        },
        {
            title: "Maximum Subarray",
            slug: "maximum-subarray",
            difficulty: "medium",
            status: "published",
            acceptance: 49.7,
            topics: ["Array", "Dynamic Programming", "Greedy"],
            statement: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
            inputFormat: "The first line contains n. The second line contains n integers.",
            outputFormat: "Print the maximum subarray sum.",
            constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
            examples: [
                {
                    input: "9\n-2 1 -3 4 -1 2 1 -5 4",
                    output: "6",
                    explanation: "The subarray [4,-1,2,1] has the largest sum 6."
                }
            ]
        },
        {
            title: "Number of Islands",
            slug: "number-of-islands",
            difficulty: "medium",
            status: "draft",
            acceptance: 46.2,
            topics: ["Graph", "Queue"],
            statement: "Given a 2D grid of land and water, count the number of islands.",
            inputFormat: "The first line contains rows and columns. The next rows contain the grid.",
            outputFormat: "Print the number of islands.",
            constraints: "1 <= m, n <= 300",
            examples: [
                {
                    input: "4 5\n11110\n11010\n11000\n00000",
                    output: "1",
                    explanation: "There is one connected island."
                }
            ]
        }
    ];
    const createdProblems = [];
    for (const problemData of problemsData) {
        const problem = await prisma.problem.create({
            data: {
                title: problemData.title,
                slug: problemData.slug,
                difficulty: problemData.difficulty,
                status: problemData.status,
                acceptance: problemData.acceptance,
                statement: problemData.statement,
                inputFormat: problemData.inputFormat,
                outputFormat: problemData.outputFormat,
                constraints: problemData.constraints,
                examples: {
                    create: problemData.examples.map((example, index) => ({
                        input: example.input,
                        output: example.output,
                        explanation: example.explanation,
                        orderIndex: index
                    }))
                },
                codeTemplates: {
                    create: [
                        {
                            language: "python",
                            starterCode: "class Solution:\n    def solve(self):\n        pass\n"
                        },
                        {
                            language: "javascript",
                            starterCode: "function solve(input) {\n  // Write your code here\n}\n"
                        },
                        {
                            language: "typescript",
                            starterCode: "function solve(input: string): string {\n  return \"\";\n}\n"
                        },
                        {
                            language: "cpp",
                            starterCode: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n"
                        },
                        {
                            language: "java",
                            starterCode: "class Main {\n  public static void main(String[] args) {\n  }\n}\n"
                        }
                    ]
                }
            }
        });
        for (const topicName of problemData.topics) {
            const topicId = topics.get(topicName);
            if (!topicId) {
                throw new Error(`Missing topic: ${topicName}`);
            }
            await prisma.problemTopic.create({
                data: {
                    problemId: problem.id,
                    topicId
                }
            });
        }
        const sampleExample = problemData.examples[0];
        if (!sampleExample) {
            throw new Error(`Problem ${problemData.title} must have at leat one example.`);
        }
        await prisma.testcase.createMany({
            data: [
                {
                    problemId: problem.id,
                    input: sampleExample.input,
                    expectedOutput: sampleExample.output,
                    visibility: "sample",
                    weight: 1,
                    orderIndex: 0
                },
                {
                    problemId: problem.id,
                    input: sampleExample.input,
                    expectedOutput: sampleExample.output,
                    visibility: "hidden",
                    weight: 1,
                    orderIndex: 1
                }
            ]
        });
        createdProblems.push(problem);
    }
    const twoSum = createdProblems.find((problem) => problem.slug === "two-sum");
    const validParentheses = createdProblems.find((problem) => problem.slug === "valid-parentheses");
    const maximumSubarray = createdProblems.find((problem) => problem.slug === "maximum-subarray");
    if (!twoSum || !validParentheses || !maximumSubarray) {
        throw new Error("Seed problems missing.");
    }
    await prisma.submission.createMany({
        data: [
            {
                userId: user.id,
                problemId: twoSum.id,
                language: "python",
                sourceCode: "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n",
                result: "accepted",
                executionTimeMs: 42,
                memoryKb: 16384
            },
            {
                userId: user.id,
                problemId: validParentheses.id,
                language: "javascript",
                sourceCode: "function isValid(s) {\n  const stack = [];\n  return true;\n}\n",
                result: "wrong_answer",
                executionTimeMs: 31,
                memoryKb: 12000
            },
            {
                userId: user.id,
                problemId: maximumSubarray.id,
                language: "typescript",
                sourceCode: "function maxSubArray(nums: number[]): number {\n  return 0;\n}\n",
                result: "pending"
            }
        ]
    });
    console.log("✅ Seed completed.");
    console.log("");
    console.log("Admin:");
    console.log("  email: admin@codenix.dev");
    console.log("  password: Password123");
    console.log("");
    console.log("User:");
    console.log("  email: user@codenix.dev");
    console.log("  password: Password123");
}
main()
    .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map