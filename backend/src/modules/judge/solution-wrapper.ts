import type { SupportedJudgeLanguage } from "./supported-languages";

const PYTHON_WRAPPER = `

# Codenix runtime adapter. The user only implements solve(data).
import json as __codenix_json
import sys as __codenix_sys
__codenix_data = __codenix_json.loads(__codenix_sys.stdin.read())
__codenix_result = solve(__codenix_data)
print(__codenix_json.dumps(__codenix_result, separators=(",", ":")))
`;

const JAVASCRIPT_WRAPPER = `

// Codenix runtime adapter. The user only implements solve(data).
const __codenix_fs = require("fs");
const __codenix_data = JSON.parse(__codenix_fs.readFileSync(0, "utf8"));
const __codenix_result = solve(__codenix_data);
console.log(JSON.stringify(__codenix_result));
`;

const TYPESCRIPT_WRAPPER = `

// Codenix runtime adapter. The user only implements solve(data).
const __codenix_fs = require("fs");
const __codenix_data = JSON.parse(__codenix_fs.readFileSync(0, "utf8"));
const __codenix_result = solve(__codenix_data);
console.log(JSON.stringify(__codenix_result));
`;

const C_WRAPPER = `

/* Codenix runtime adapter. solve receives the serialized test input. */
int main(void) {
  char input[65536];
  size_t length = fread(input, 1, sizeof(input) - 1, stdin);
  input[length] = '\\0';
  solve(input);
  return 0;
}
`;

const RUST_WRAPPER = `

// Codenix runtime adapter. solve receives the serialized test input.
fn main() {
    use std::io::{self, Read};
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    solve(&input);
}
`;

export function wrapSolutionSource(
  language: SupportedJudgeLanguage,
  sourceCode: string,
) {
  if (language === "python") return `${sourceCode}${PYTHON_WRAPPER}`;
  if (language === "javascript") return `${sourceCode}${JAVASCRIPT_WRAPPER}`;
  if (language === "typescript") return `${sourceCode}${TYPESCRIPT_WRAPPER}`;
  if (language === "c") return `${sourceCode}${C_WRAPPER}`;
  return `${sourceCode}${RUST_WRAPPER}`;
}

export function validateSolutionSource(
  language: SupportedJudgeLanguage,
  sourceCode: string,
) {
  const hasSolveFunction =
    language === "python"
      ? /(?:def\s+solve\s*\(|def\s+solve\s*\[)/.test(sourceCode)
      : language === "rust"
        ? /fn\s+solve\s*\(/.test(sourceCode)
        : /(?:function\s+solve\s*\(|\bsolve\s*=\s*(?:\([^)]*\)|[^=]+)=>|void\s+solve\s*\(|int\s+solve\s*\()/.test(sourceCode);

  if (!hasSolveFunction) {
    return "Tu solucion debe implementar una funcion solve(data).";
  }

  if (sourceCode.length > 50_000) {
    return "La solucion supera el limite de 50 KB.";
  }

  return null;
}
