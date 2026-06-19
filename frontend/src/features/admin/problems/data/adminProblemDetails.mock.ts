import type {
  AdminProblemDetails,
  ProblemLanguage,
  ProblemCodeTemplate,
} from '@/features/admin/problems/types/problem.types'

const defaultCodeTemplates: ProblemCodeTemplate[] = [
  {
    language: 'Python',
    starterCode: 'class Solution:\n    def solve(self):\n        pass\n',
  },
  {
    language: 'Java',
    starterCode: 'class Solution {\n    public void solve() {\n    }\n}\n',
  },
  {
    language: 'C++',
    starterCode: '#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n    }\n};\n',
  },
  {
    language: 'TypeScript',
    starterCode: 'function solve(): void {\n}\n',
  },
]

const defaultStarterCode: Record<ProblemLanguage, string> = {
  typescript: 'function solve(input: string): string {\n  return ""\n}\n',
  javascript: 'function solve(input) {\n  return ""\n}\n',
  python: 'def solve(data: str) -> str:\n    return ""\n',
  java: 'class Solution {\n    public String solve(String input) {\n        return "";\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const string& input) {\n    return "";\n}\n',
}

export const createDefaultCodeTemplates = () =>
  defaultCodeTemplates.map((template) => ({ ...template }))

export const createDefaultStarterCode = () => ({ ...defaultStarterCode })

export const createDefaultProblemParameters = () => [
  { id: 'param-nums', name: 'nums', type: 'number[]' as const, description: 'Input numbers' },
  { id: 'param-target', name: 'target', type: 'number' as const, description: 'Target sum' },
]

export const createDefaultStructuredTestcases = () => [
  {
    id: 'case-sample-1',
    input: { nums: [2, 7, 11, 15], target: 9 },
    expectedOutput: [0, 1],
    isSample: true,
  },
  {
    id: 'case-hidden-1',
    input: { nums: [3, 2, 4], target: 6 },
    expectedOutput: [1, 2],
    isSample: false,
  },
]

export const adminProblemDetailsMock: AdminProblemDetails[] = [
  {
    id: 'prob-001',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    tags: ['Array', 'Hash Map'],
    status: 'published',
    testcasesCount: 18,
    updatedAt: '2026-06-12T14:20:00.000Z',
    statement:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    descriptionMarkdown:
      '## Description\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\n## Examples\n\nUse the examples below to understand the expected output.',
    inputFormat: 'An integer array nums and an integer target.',
    outputFormat: 'Return a pair of zero-based indices.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
    constraintsList: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    parameters: createDefaultProblemParameters(),
    outputType: 'number[]',
    testcases: createDefaultStructuredTestcases(),
    supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'cpp'],
    starterCode: createDefaultStarterCode(),
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      {
        id: 'ex-001',
        input: 'nums = [2,7,11,15]\ntarget = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] equals 9.',
      },
    ],
    codeTemplates: createDefaultCodeTemplates(),
  },
  {
    id: 'prob-002',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'medium',
    tags: ['String', 'Sliding Window'],
    status: 'published',
    testcasesCount: 24,
    updatedAt: '2026-06-11T09:45:00.000Z',
    statement:
      'Given a string s, find the length of the longest substring without repeating characters.',
    descriptionMarkdown:
      '## Description\n\nGiven a string `s`, find the length of the longest substring without repeating characters.',
    inputFormat: 'A single string s.',
    outputFormat: 'Return one integer: the maximum substring length.',
    constraints: '0 <= s.length <= 5 * 10^4',
    constraintsList: ['0 <= s.length <= 5 * 10^4'],
    parameters: [{ id: 'param-s', name: 's', type: 'string', description: 'Input string' }],
    outputType: 'number',
    testcases: [
      {
        id: 'case-sample-2',
        input: { s: 'abcabcbb' },
        expectedOutput: 3,
        isSample: true,
      },
      {
        id: 'case-hidden-2',
        input: { s: 'bbbbb' },
        expectedOutput: 1,
        isSample: false,
      },
    ],
    supportedLanguages: ['typescript', 'javascript', 'python', 'java'],
    starterCode: createDefaultStarterCode(),
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    examples: [
      {
        id: 'ex-002',
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc".',
      },
    ],
    codeTemplates: createDefaultCodeTemplates(),
  },
  {
    id: 'prob-003',
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium',
    tags: ['Array', 'Sorting'],
    status: 'draft',
    testcasesCount: 12,
    updatedAt: '2026-06-09T18:10:00.000Z',
    statement: 'Given an array of intervals, merge all overlapping intervals.',
    descriptionMarkdown:
      '## Description\n\nGiven an array of intervals, merge all overlapping intervals.',
    inputFormat: 'A list of intervals where intervals[i] = [start, end].',
    outputFormat: 'Return the merged intervals sorted by start.',
    constraints: '1 <= intervals.length <= 10^4',
    constraintsList: ['1 <= intervals.length <= 10^4'],
    parameters: [
      { id: 'param-intervals', name: 'intervals', type: 'object', description: 'Intervals matrix' },
    ],
    outputType: 'object',
    testcases: [
      {
        id: 'case-sample-3',
        input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] },
        expectedOutput: [[1, 6], [8, 10], [15, 18]],
        isSample: true,
      },
      {
        id: 'case-hidden-3',
        input: { intervals: [[1, 4], [4, 5]] },
        expectedOutput: [[1, 5]],
        isSample: false,
      },
    ],
    supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'cpp'],
    starterCode: createDefaultStarterCode(),
    timeLimitMs: 3000,
    memoryLimitMb: 256,
    examples: [
      {
        id: 'ex-003',
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
      },
    ],
    codeTemplates: createDefaultCodeTemplates(),
  },
]
