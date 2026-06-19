import type { SupportedJudgeLanguage } from "../src/modules/judge/supported-languages";

type ReferenceSolutions = Record<SupportedJudgeLanguage, string>;

const twoSum: ReferenceSolutions = {
  python: `import json
import sys

data = json.loads(sys.stdin.read())
seen = {}
for index, number in enumerate(data["nums"]):
    complement = data["target"] - number
    if complement in seen:
        print(json.dumps([seen[complement], index], separators=(",", ":")))
        break
    seen[number] = index
`,
  javascript: `const fs = require("fs");
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const seen = new Map();
for (let index = 0; index < data.nums.length; index += 1) {
  const complement = data.target - data.nums[index];
  if (seen.has(complement)) {
    console.log(JSON.stringify([seen.get(complement), index]));
    break;
  }
  seen.set(data.nums[index], index);
}
`,
  typescript: `declare const require: (name: string) => any;
const fs = require("fs");
const data = JSON.parse(fs.readFileSync(0, "utf8")) as { nums: number[]; target: number };
const seen = new Map<number, number>();
for (let index = 0; index < data.nums.length; index += 1) {
  const complement = data.target - data.nums[index];
  if (seen.has(complement)) {
    console.log(JSON.stringify([seen.get(complement), index]));
    break;
  }
  seen.set(data.nums[index], index);
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
  char input[65536];
  size_t length = fread(input, 1, sizeof(input) - 1, stdin);
  input[length] = '\0';
  long values[10005];
  int count = 0;
  char *cursor = input;
  while (*cursor != '\0') {
    if ((*cursor >= '0' && *cursor <= '9') ||
        (*cursor == '-' && cursor[1] >= '0' && cursor[1] <= '9')) {
      values[count++] = strtol(cursor, &cursor, 10);
    } else {
      cursor++;
    }
  }
  long target = values[count - 1];
  for (int left = 0; left < count - 2; left++) {
    for (int right = left + 1; right < count - 1; right++) {
      if (values[left] + values[right] == target) {
        printf("[%d,%d]\\n", left, right);
        return 0;
      }
    }
  }
  return 0;
}
`,
  rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut values: Vec<i64> = input
        .split(|character: char| !(character.is_ascii_digit() || character == '-'))
        .filter(|part| !part.is_empty() && *part != "-")
        .map(|part| part.parse::<i64>().unwrap())
        .collect();
    let target = values.pop().unwrap();
    for left in 0..values.len() {
        for right in (left + 1)..values.len() {
            if values[left] + values[right] == target {
                println!("[{},{}]", left, right);
                return;
            }
        }
    }
}
`
};

const validParentheses: ReferenceSolutions = {
  python: `import json
import sys

s = json.loads(sys.stdin.read())["s"]
stack = []
pairs = {")": "(", "]": "[", "}": "{"}
valid = True
for character in s:
    if character in "([{":
        stack.append(character)
    elif not stack or stack.pop() != pairs[character]:
        valid = False
        break
print(json.dumps(valid and not stack))
`,
  javascript: `const fs = require("fs");
const s = JSON.parse(fs.readFileSync(0, "utf8")).s;
const stack = [];
const pairs = { ")": "(", "]": "[", "}": "{" };
let valid = true;
for (const character of s) {
  if ("([{".includes(character)) stack.push(character);
  else if (stack.pop() !== pairs[character]) {
    valid = false;
    break;
  }
}
console.log(JSON.stringify(valid && stack.length === 0));
`,
  typescript: `declare const require: (name: string) => any;
const fs = require("fs");
const s = (JSON.parse(fs.readFileSync(0, "utf8")) as { s: string }).s;
const stack: string[] = [];
const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
let valid = true;
for (const character of s) {
  if ("([{".includes(character)) stack.push(character);
  else if (stack.pop() !== pairs[character]) {
    valid = false;
    break;
  }
}
console.log(JSON.stringify(valid && stack.length === 0));
`,
  c: `#include <stdbool.h>
#include <stdio.h>
#include <string.h>

int main(void) {
  char input[65536];
  size_t length = fread(input, 1, sizeof(input) - 1, stdin);
  input[length] = '\0';
  char *start = strstr(input, "\\\"s\\\":\\\"");
  if (start == NULL) return 1;
  start += 5;
  char stack[65536];
  int top = 0;
  bool valid = true;
  for (char *cursor = start; *cursor != '\0' && *cursor != '\"'; cursor++) {
    char character = *cursor;
    if (character == '(' || character == '[' || character == '{') {
      stack[top++] = character;
      continue;
    }
    char expected = character == ')' ? '(' : character == ']' ? '[' : '{';
    if (top == 0 || stack[--top] != expected) {
      valid = false;
      break;
    }
  }
  printf(valid && top == 0 ? "true\\n" : "false\\n");
  return 0;
}
`,
  rust: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let value = input.split("\\\"s\\\":\\\"").nth(1).unwrap();
    let s = value.split('"').next().unwrap();
    let mut stack: Vec<char> = Vec::new();
    let mut valid = true;
    for character in s.chars() {
        if "([{".contains(character) {
            stack.push(character);
            continue;
        }
        let expected = match character { ')' => '(', ']' => '[', _ => '{' };
        if stack.pop() != Some(expected) {
            valid = false;
            break;
        }
    }
    println!("{}", valid && stack.is_empty());
}
`
};

export const REFERENCE_SOLUTIONS: Record<
  "two-sum" | "valid-parentheses",
  ReferenceSolutions
> = {
  "two-sum": twoSum,
  "valid-parentheses": validParentheses
};
