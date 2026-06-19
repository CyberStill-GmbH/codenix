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
  c: '#include <stdio.h>\n\nint main(void) {\n    return 0;\n}\n',
  rust: 'fn main() {\n}\n',
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
