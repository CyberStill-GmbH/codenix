import type {
  ProblemCodeTemplate,
  ProblemLanguage,
  ProblemParameter,
  StructuredProblemTestcase,
} from '@/features/admin/problems/types/problem.types'

export const starterCodeTemplates: Record<ProblemLanguage, string> = {
  typescript: 'function solve(input: string): string {\n  return ""\n}\n',
  javascript: 'function solve(input) {\n  return ""\n}\n',
  python: 'def solve(data: str) -> str:\n    return ""\n',
  java: 'class Solution {\n    public String solve(String input) {\n        return "";\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const string& input) {\n    return "";\n}\n',
}

export function createDefaultStarterCode() {
  return { ...starterCodeTemplates }
}

export function createDefaultCodeTemplates(): ProblemCodeTemplate[] {
  return Object.entries(starterCodeTemplates).map(([language, starterCode]) => ({
    language,
    starterCode,
  }))
}

export function createDefaultProblemParameters(): ProblemParameter[] {
  return [
    {
      id: 'param-input',
      name: 'input',
      type: 'string',
      description: 'Entrada principal del problema',
    },
  ]
}

export function createDefaultStructuredTestcases(): StructuredProblemTestcase[] {
  return []
}
