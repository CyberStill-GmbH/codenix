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

function cArgumentNames(parameters: Array<{ name: string; type: string }>) {
  return parameters.flatMap((parameter) => {
    if (parameter.type === "number[]") return [parameter.name, `${parameter.name}Size`];
    if (parameter.type === "number[][]") return [parameter.name, `${parameter.name}Rows`, `${parameter.name}Cols`];
    return [parameter.name];
  });
}

function buildCWrapper(
  functionName: string,
  parameters: Array<{ name: string; type: string }>,
  outputType: string,
) {
  const declarations = parameters.map((parameter) => {
    if (parameter.type === "number[]" || parameter.type === "number[][]") {
      const shape = parameter.type === "number[][]" ? `size_t ${parameter.name}Rows = 0, ${parameter.name}Cols = 0;` : `size_t ${parameter.name}Size = 0;`;
      return `int ${parameter.name}[4096]; ${shape} __codenix_parse_array(input, "${parameter.name}", ${parameter.name}, &${parameter.name}${parameter.type === "number[][]" ? "Rows" : "Size"}, ${parameter.type === "number[][]" ? `&${parameter.name}Cols` : "NULL"});`;
    }
    if (parameter.type === "string") return `char ${parameter.name}[4096]; __codenix_parse_string(input, "${parameter.name}", ${parameter.name}, sizeof(${parameter.name}));`;
    return `int ${parameter.name} = __codenix_parse_int(input, "${parameter.name}");`;
  }).join("\n    ");
  const args = cArgumentNames(parameters).join(", ");
  const call = outputType === "number[]" || outputType === "number[][]"
    ? `size_t returnSize = 0; int *result = ${functionName}(${args}${args ? ", " : ""}&returnSize); for (size_t i = 0; i < returnSize; i++) printf("%s%d", i ? "," : "", result[i]); printf("\\n");`
    : outputType === "string"
      ? `printf("%s\\n", ${functionName}(${args}));`
      : `printf("%d\\n", ${functionName}(${args}));`;
  return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static const char *__codenix_value(const char *input, const char *key) {
    static char needle[128];
    snprintf(needle, sizeof(needle), "\\\"%s\\\"", key);
    const char *found = strstr(input, needle);
    if (!found) return "0";
    found = strchr(found + strlen(needle), ':');
    return found ? found + 1 : "0";
}
static int __codenix_parse_int(const char *input, const char *key) { return (int)strtol(__codenix_value(input, key), NULL, 10); }
static void __codenix_parse_string(const char *input, const char *key, char *out, size_t capacity) {
    const char *value = __codenix_value(input, key); while (*value && (*value == ' ' || *value == '\\"')) value++;
    size_t i = 0; while (value[i] && value[i] != '\\"' && value[i] != '}' && i + 1 < capacity) { out[i] = value[i]; i++; } out[i] = '\\0';
}
static void __codenix_parse_array(const char *input, const char *key, int *out, size_t *size, size_t *cols) {
    const char *value = __codenix_value(input, key); while (*value && *value != '[') value++; if (!*value) { *size = 0; return; }
    size_t count = 0, depth = 0, currentCols = 0; int inNumber = 0; long number = 0;
    for (; *value && count < 4096; value++) { if (*value == '[') { depth++; if (depth == 2) currentCols = 0; } else if (*value == ']') { if (depth == 2 && cols && currentCols > *cols) *cols = currentCols; if (depth) depth--; } else if ((*value >= '0' && *value <= '9') || *value == '-') { if (!inNumber) { number = strtol(value, (char **)&value, 10); out[count++] = (int)number; inNumber = 1; currentCols++; value--; } } else { inNumber = 0; } }
    *size = count; if (cols && *cols == 0) *cols = count;
}
int main(void) {
    char input[65536]; size_t length = fread(input, 1, sizeof(input) - 1, stdin); input[length] = '\\0';
    ${declarations}
    ${call}
    return 0;
}
`;
}

function rustType(type: string) {
  if (type === "number[]") return "Vec<i32>";
  if (type === "number[][]") return "Vec<Vec<i32>>";
  if (type === "string") return "String";
  return "i32";
}

function rustParser(type: string, name: string) {
  const field = `__codenix_field(&input, ${JSON.stringify(name)})`;
  if (type === "number[]") return `__codenix_vec_i32(&${field})`;
  if (type === "number[][]") return `__codenix_vec_vec_i32(&${field})`;
  if (type === "string") return `__codenix_string(&${field})`;
  return `__codenix_i32(&${field})`;
}

function rustPrinter(outputType: string) {
  if (outputType === "string") return `println!("{:?}", result);`;
  return `println!("{:?}", result);`;
}

function buildRustWrapper(
  functionName: string,
  parameters: Array<{ name: string; type: string }>,
  outputType: string,
) {
  const args = parameters.map((parameter) => rustParser(parameter.type, parameter.name)).join(", ");
  const helpers = `
fn __codenix_field(input: &str, key: &str) -> String {
    let needle = format!("\\\"{}\\\"", key);
    let start = input.find(&needle).unwrap_or(0) + needle.len();
    let rest = input[start..].trim_start_matches(|c: char| c == ':' || c.is_whitespace());
    if rest.starts_with('[') {
        let mut depth = 0;
        for (index, character) in rest.char_indices() {
            if character == '[' { depth += 1; }
            if character == ']' { depth -= 1; if depth == 0 { return rest[..=index].to_string(); } }
        }
    }
    if rest.starts_with('\\\"') {
        if let Some(end) = rest[1..].find('\\\"') { return rest[..end + 2].to_string(); }
    }
    rest.split(',').next().unwrap_or(rest).trim().trim_end_matches('}').to_string()
}

fn __codenix_i32(value: &str) -> i32 { value.trim().parse().unwrap_or_default() }
fn __codenix_string(value: &str) -> String { value.trim().trim_matches('\\\"').replace("\\\\\\\"", "\\\"") }
fn __codenix_vec_i32(value: &str) -> Vec<i32> {
    value.trim().trim_start_matches('[').trim_end_matches(']').split(',')
        .filter_map(|item| item.trim().parse::<i32>().ok()).collect()
}
fn __codenix_vec_vec_i32(value: &str) -> Vec<Vec<i32>> {
    let mut rows = Vec::new();
    let mut depth = 0;
    let mut start = 0;
    let trimmed = value.trim();
    for (index, character) in trimmed.char_indices() {
        if character == '[' { depth += 1; if depth == 2 { start = index; } }
        if character == ']' { depth -= 1; if depth == 1 { rows.push(__codenix_vec_i32(&trimmed[start..=index])); } }
    }
    rows
}
`;
  return `${helpers}
fn main() {
    use std::io::{self, Read};
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let result = ${functionName}(${args});
    ${rustPrinter(outputType)}
}
`;
}

export function wrapSolutionSource(
  language: SupportedJudgeLanguage,
  sourceCode: string,
  parameters: unknown,
  outputType = "number",
  functionName = "solve",
) {
  const parameterDefinitions = Array.isArray(parameters)
    ? parameters.flatMap((parameter) => {
        if (!parameter || typeof parameter !== "object") return [];
        const name = (parameter as { name?: unknown }).name;
        const type = (parameter as { type?: unknown }).type;
        return typeof name === "string" && /^[A-Za-z_$][\w$]*$/.test(name)
          ? [{ name, type: typeof type === "string" ? type : "number" }]
          : [];
      })
    : [];
  const names = parameterDefinitions.map((parameter) => parameter.name);
  const args = names.map((name) => `__codenix_data[${JSON.stringify(name)}]`).join(", ");
  if (language === "python") {
    return `${sourceCode}${PYTHON_WRAPPER.replace("solve(__codenix_data)", `${functionName}(${names.map((name) => `__codenix_data[${JSON.stringify(name)}]`).join(", ")})`)}`;
  }
  if (language === "javascript") {
    return `${sourceCode}${JAVASCRIPT_WRAPPER.replace("solve(__codenix_data)", `${functionName}(${args})`)}`;
  }
  if (language === "typescript") {
    return `${sourceCode}${TYPESCRIPT_WRAPPER.replace("solve(__codenix_data)", `${functionName}(${args})`)}`;
  }
  if (language === "c") return `${sourceCode}${buildCWrapper(functionName, parameterDefinitions, outputType)}`;
  return `${sourceCode}${buildRustWrapper(functionName, parameterDefinitions, outputType)}`;
}

export function validateSolutionSource(
  language: SupportedJudgeLanguage,
  sourceCode: string,
  functionName = "solve",
) {
  const escapedFunctionName = functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hasSolveFunction =
    language === "python"
      ? new RegExp(`def\\s+${escapedFunctionName}\\s*\\(`).test(sourceCode)
      : language === "rust"
        ? new RegExp(`fn\\s+${escapedFunctionName}\\s*\\(`).test(sourceCode)
        : new RegExp(`(?:function\\s+${escapedFunctionName}\\s*\\(|\\b${escapedFunctionName}\\s*=\\s*(?:\\([^)]*\\)|[^=]+)=>|void\\s+${escapedFunctionName}\\s*\\(|int\\s+${escapedFunctionName}\\s*\\()`).test(sourceCode);

  if (!hasSolveFunction) {
    return `Tu solucion debe implementar la funcion ${functionName} con la firma del problema.`;
  }

  if (sourceCode.length > 50_000) {
    return "La solucion supera el limite de 50 KB.";
  }

  return null;
}
