import type { AdminProblem } from '@/features/admin/problems/types/problem.types'

export const adminProblemsMock: AdminProblem[] = [
  {
    id: 'prob-001',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    tags: ['Array', 'Hash Map'],
    status: 'published',
    testcasesCount: 18,
    updatedAt: '2026-06-12T14:20:00.000Z',
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
  },
  {
    id: 'prob-004',
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: 'hard',
    tags: ['Tree', 'DFS', 'Dynamic Programming'],
    status: 'draft',
    testcasesCount: 0,
    updatedAt: '2026-06-07T22:05:00.000Z',
  },
  {
    id: 'prob-005',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    tags: ['Stack', 'String'],
    status: 'published',
    testcasesCount: 16,
    updatedAt: '2026-06-05T11:30:00.000Z',
  },
  {
    id: 'prob-006',
    title: 'Course Schedule',
    slug: 'course-schedule',
    difficulty: 'medium',
    tags: ['Graph', 'Topological Sort'],
    status: 'draft',
    testcasesCount: 21,
    updatedAt: '2026-06-01T16:15:00.000Z',
  },
]

export const adminProblemTagsMock = Array.from(
  new Set(adminProblemsMock.flatMap((problem) => problem.tags)),
).sort((firstTag, secondTag) => firstTag.localeCompare(secondTag))
