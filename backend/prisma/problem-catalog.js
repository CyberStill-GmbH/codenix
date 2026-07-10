const twoSumStarterCode = {
    python: `import json
import sys

def solve(nums: list[int], target: int) -> list[int]:
    # Escribe tu solucion aqui.
    return []

data = json.loads(sys.stdin.read())
print(json.dumps(solve(data["nums"], data["target"]), separators=(",", ":")))
`,
    javascript: `const fs = require("fs");

function solve(nums, target) {
  // Escribe tu solucion aqui.
  return [];
}

const data = JSON.parse(fs.readFileSync(0, "utf8"));
console.log(JSON.stringify(solve(data.nums, data.target)));
`,
    typescript: `declare const require: (name: string) => any;
const fs = require("fs");

function solve(nums: number[], target: number): number[] {
  // Escribe tu solucion aqui.
  return [];
}

const data = JSON.parse(fs.readFileSync(0, "utf8"));
console.log(JSON.stringify(solve(data.nums, data.target)));
`,
    c: `#include <stdio.h>

int main(void) {
  /* Escribe tu solucion aqui. */
  return 0;
}
`,
    rust: `fn main() {
    // Escribe tu solucion aqui.
}
`
};
const validParenthesesStarterCode = {
    python: `import json
import sys

def solve(s: str) -> bool:
    # Escribe tu solucion aqui.
    return False

data = json.loads(sys.stdin.read())
print(json.dumps(solve(data["s"])))
`,
    javascript: `const fs = require("fs");

function solve(s) {
  // Escribe tu solucion aqui.
  return false;
}

const data = JSON.parse(fs.readFileSync(0, "utf8"));
console.log(JSON.stringify(solve(data.s)));
`,
    typescript: `declare const require: (name: string) => any;
const fs = require("fs");

function solve(s: string): boolean {
  // Escribe tu solucion aqui.
  return false;
}

const data = JSON.parse(fs.readFileSync(0, "utf8"));
console.log(JSON.stringify(solve(data.s)));
`,
    c: `#include <stdio.h>

int main(void) {
  /* Escribe tu solucion aqui. */
  return 0;
}
`,
    rust: `fn main() {
    // Escribe tu solucion aqui.
}
`
};
export const PROBLEM_CATALOG = [
    {
        numericId: 1,
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "easy",
        statement: `## Descripcion

Dado un arreglo de enteros \`nums\` y un entero \`target\`, devuelve los indices de los dos numeros cuya suma sea igual a \`target\`.

Puedes asumir que cada entrada tiene exactamente una solucion y no puedes usar el mismo elemento dos veces.

## Ejemplos

Los indices pueden devolverse en cualquier orden siempre que identifiquen la pareja correcta.

## Constraints

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i], target <= 10^9\`
- Existe exactamente una solucion valida.`,
        inputFormat: "JSON object with nums (number[]) and target (number).",
        outputFormat: "JSON array with the two zero-based indices.",
        constraints: "2 <= nums.length <= 10000\n-1000000000 <= nums[i], target <= 1000000000\nExactly one valid answer exists.",
        parameters: [
            { name: "nums", type: "number[]", description: "Input numbers." },
            { name: "target", type: "number", description: "Required sum." }
        ],
        outputType: "number[]",
        topics: ["Arrays", "Hash Table"],
        examples: [
            {
                input: '{"nums":[2,7,11,15],"target":9}',
                output: "[0,1]",
                explanation: "nums[0] + nums[1] = 9."
            },
            {
                input: '{"nums":[3,2,4],"target":6}',
                output: "[1,2]",
                explanation: "nums[1] + nums[2] = 6."
            }
        ],
        testcases: [
            { input: '{"nums":[2,7,11,15],"target":9}', expectedOutput: "[0,1]", visibility: "sample" },
            { input: '{"nums":[3,2,4],"target":6}', expectedOutput: "[1,2]", visibility: "sample" },
            { input: '{"nums":[3,3],"target":6}', expectedOutput: "[0,1]", visibility: "hidden" },
            { input: '{"nums":[-1,-2,-3,-4,-5],"target":-8}', expectedOutput: "[2,4]", visibility: "hidden" },
            { input: '{"nums":[1,5,3,7],"target":10}', expectedOutput: "[2,3]", visibility: "hidden" },
            { input: '{"nums":[0,4,3,0],"target":0}', expectedOutput: "[0,3]", visibility: "hidden" },
            { input: '{"nums":[2,5,5,11],"target":10}', expectedOutput: "[1,2]", visibility: "hidden" },
            { input: '{"nums":[10,-2,8,4],"target":6}', expectedOutput: "[1,2]", visibility: "hidden" }
        ],
        starterCode: twoSumStarterCode
    },
    {
        numericId: 2,
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "easy",
        statement: `## Descripcion

Dada una cadena \`s\` que contiene solo los caracteres \`( ) { } [ ]\`, determina si la secuencia es valida.

Una secuencia es valida cuando cada simbolo de apertura se cierra con el mismo tipo y en el orden correcto.

## Constraints

- \`0 <= s.length <= 10^4\`
- \`s\` contiene solamente parentesis, corchetes y llaves.`,
        inputFormat: "JSON object with s (string).",
        outputFormat: "JSON boolean.",
        constraints: "0 <= s.length <= 10000\ns contains only parentheses, brackets, and braces.",
        parameters: [
            { name: "s", type: "string", description: "Bracket sequence." }
        ],
        outputType: "boolean",
        topics: ["Stack", "String"],
        examples: [
            {
                input: '{"s":"()"}',
                output: "true",
                explanation: "The pair closes in the correct order."
            },
            {
                input: '{"s":"()[]{}"}',
                output: "true",
                explanation: "Every opening symbol has a matching close."
            },
            {
                input: '{"s":"(]"}',
                output: "false",
                explanation: "The closing symbol does not match the opening one."
            }
        ],
        testcases: [
            { input: '{"s":"()"}', expectedOutput: "true", visibility: "sample" },
            { input: '{"s":"()[]{}"}', expectedOutput: "true", visibility: "sample" },
            { input: '{"s":""}', expectedOutput: "true", visibility: "hidden" },
            { input: '{"s":"{[]}"}', expectedOutput: "true", visibility: "hidden" },
            { input: '{"s":"([)]"}', expectedOutput: "false", visibility: "hidden" },
            { input: '{"s":"(((())))"}', expectedOutput: "true", visibility: "hidden" },
            { input: '{"s":"("}', expectedOutput: "false", visibility: "hidden" },
            { input: '{"s":"]"}', expectedOutput: "false", visibility: "hidden" }
        ],
        starterCode: validParenthesesStarterCode
    }
];
//# sourceMappingURL=problem-catalog.js.map