import type { SupportedJudgeLanguage } from "../src/modules/judge/supported-languages";
import type { ProblemSeed } from "./problem-catalog";

type JsonValue = Record<string, unknown>;

const STARTER_CODE: Record<SupportedJudgeLanguage, string> = {
  python: `def solve(data):\n    # Implementa la funcion para este problema.\n    return None\n`,
  javascript: `function solve(data) {\n  // Implementa la funcion para este problema.\n  return null;\n}\n`,
  typescript: `function solve(data: Record<string, unknown>): unknown {\n  // Implementa la funcion para este problema.\n  return null;\n}\n`,
  c: `#include <stddef.h>\n\nvoid solve(const char *input) {\n  (void)input;\n  /* Implementa la funcion para este problema. */\n}\n`,
  rust: `fn solve(input: &str) {\n    let _ = input;\n    // Implementa la funcion para este problema.\n}\n`
};

type Case = { data: JsonValue; expected: unknown };
type Operation = {
  title: string;
  slug: string;
  topics: string[];
  difficulty: ProblemSeed["difficulty"];
  description: string;
  output: string;
  cases: (variant: number) => Case[];
};

const arrays = (variant: number) => [
  [variant - 3, 0, 4, -2, variant + 1],
  [7, 7, variant, 0, -5],
  [variant, variant + 2, variant + 4],
  [-8, -3, -1, variant - 2],
  [0, 0, 0, variant + 5]
];

const matrix = (variant: number) => [
  [[1, variant], [3, 4]],
  [[0, 2, 0], [4, 1, variant], [3, 0, 5]],
  [[variant, -1], [2, 6], [0, 3]]
];

const strings = (variant: number) => [
  `codenix${variant}`,
  "level",
  "a quiet river",
  "Data Structures",
  "abacabad"
];

const samples = <T>(
  inputs: T[],
  makeData: (input: T) => JsonValue,
  solve: (input: T) => unknown
): Case[] => inputs.map((input) => ({ data: makeData(input), expected: solve(input) }));

const arrayOps: Operation[] = [
  {
    title: "Suma del inventario",
    slug: "inventory-sum",
    topics: ["Array", "Math"], difficulty: "easy",
    description: "Calcula la suma de todos los valores de un arreglo de enteros.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.reduce((a, b) => a + b, 0))
  },
  {
    title: "Pico del sendero",
    slug: "trail-maximum",
    topics: ["Array"], difficulty: "easy",
    description: "Encuentra el valor maximo de un arreglo no vacio.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => Math.max(...values))
  },
  {
    title: "Valle del sendero",
    slug: "trail-minimum",
    topics: ["Array"], difficulty: "easy",
    description: "Encuentra el valor minimo de un arreglo no vacio.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => Math.min(...values))
  },
  {
    title: "Conteo de pulsos pares",
    slug: "even-pulse-count",
    topics: ["Array", "Math"], difficulty: "easy",
    description: "Cuenta cuantos valores pares aparecen en el arreglo.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.filter((x) => x % 2 === 0).length)
  },
  {
    title: "Conteo de señales negativas",
    slug: "negative-signal-count",
    topics: ["Array"], difficulty: "easy",
    description: "Cuenta los valores estrictamente negativos del arreglo.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.filter((x) => x < 0).length)
  },
  {
    title: "Espejo de coordenadas",
    slug: "coordinate-mirror",
    topics: ["Array", "Two Pointers"], difficulty: "easy",
    description: "Devuelve el arreglo con sus elementos en orden inverso.", output: "JSON number[]",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => [...values].reverse())
  },
  {
    title: "Desplazamiento circular",
    slug: "circular-shift",
    topics: ["Array"], difficulty: "easy",
    description: "Rota el arreglo hacia la izquierda k posiciones sin perder elementos.", output: "JSON number[]",
    cases: (v) => samples(arrays(v), (values) => ({ values, k: v % values.length }), (values) => { const k = v % values.length; return values.slice(k).concat(values.slice(0, k)); })
  },
  {
    title: "Acumulado de energia",
    slug: "energy-prefix-sums",
    topics: ["Array", "Prefix Sum"], difficulty: "easy",
    description: "Construye el arreglo de sumas prefix: cada posicion contiene la suma hasta ese indice.", output: "JSON number[]",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.reduce<number[]>((out, x) => { out.push((out.at(-1) ?? 0) + x); return out; }, []))
  },
  {
    title: "Maximo acumulado",
    slug: "running-maximum",
    topics: ["Array", "Prefix Sum"], difficulty: "easy",
    description: "Devuelve el maximo observado en cada prefijo del arreglo.", output: "JSON number[]",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.reduce<number[]>((out, x) => { out.push(Math.max(out.at(-1) ?? -Infinity, x)); return out; }, []))
  },
  {
    title: "Segundo faro",
    slug: "second-largest-beacon",
    topics: ["Array", "Sorting"], difficulty: "easy",
    description: "Devuelve el segundo valor distinto mas grande; si no existe, devuelve null.", output: "JSON number or null",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => { const u = [...new Set(values)].sort((a, b) => b - a); return u[1] ?? null; })
  },
  {
    title: "Valores unicos del mapa",
    slug: "unique-map-values",
    topics: ["Array", "Hash Table"], difficulty: "easy",
    description: "Devuelve cuantos valores diferentes contiene el arreglo.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => new Set(values).size)
  },
  {
    title: "Cero al final",
    slug: "zeros-to-end",
    topics: ["Array", "Two Pointers"], difficulty: "medium",
    description: "Mueve todos los ceros al final conservando el orden relativo de los demas valores.", output: "JSON number[]",
    cases: (v) => samples(arrays(v), (values) => ({ values }), (values) => values.filter(Boolean).concat(values.filter((x) => x === 0)))
  },
  {
    title: "Mejor tramo",
    slug: "best-contiguous-sum",
    topics: ["Array", "Dynamic Programming"], difficulty: "medium",
    description: "Encuentra la suma maxima de un subarreglo contiguo no vacio.", output: "JSON number",
    cases: (v) => samples(arrays(v).concat([[-2, 3, -1, 4, -6]]), (values) => ({ values }), (values) => values.reduce((best, x, i) => Math.max(best, values.slice(0, i + 1).reduce((a, b) => a + b, 0)), -Infinity))
  },
  {
    title: "Parejas de calibracion",
    slug: "calibration-pair-count",
    topics: ["Array", "Hash Table"], difficulty: "medium",
    description: "Cuenta las parejas de indices i < j cuyos valores suman target.", output: "JSON number",
    cases: (v) => samples(arrays(v), (values) => ({ values, target: v + 1 }), (values) => { const target = v + 1; let count = 0; for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) if (values[i] + values[j] === target) count++; return count; })
  },
  {
    title: "Hueco de la secuencia",
    slug: "sequence-missing-value",
    topics: ["Array", "Math"], difficulty: "easy",
    description: "Dado un arreglo con valores de 0 a n sin repetir salvo un hueco, devuelve el valor faltante.", output: "JSON number",
    cases: (v) => samples([0, 1, 2, 3, 4].map((missing) => ({ values: [0, 1, 2, 3, 4, 5].filter((x) => x !== missing), n: 5 })), (x) => x, (x) => { const total = x.n * (x.n + 1) / 2; return total - x.values.reduce((a, b) => a + b, 0); })
  },
  {
    title: "Voz mayoritaria",
    slug: "majority-signal",
    topics: ["Array", "Hash Table"], difficulty: "medium",
    description: "Devuelve el valor que aparece mas de la mitad de las veces; siempre existe.", output: "JSON number",
    cases: (v) => samples([[v, v, 2, v, 3], [1, 1, 1, 2, 2], [4, 4, 4, 4]], (values) => ({ values }), (values) => { const counts = new Map<number, number>(); values.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1)); return [...counts].sort((a, b) => b[1] - a[1])[0][0]; })
  }
];

const stringOps: Operation[] = [
  {
    title: "Vocales del mensaje", slug: "message-vowel-count", topics: ["String"], difficulty: "easy",
    description: "Cuenta las vocales a, e, i, o, u ignorando mayusculas y minusculas.", output: "JSON number",
    cases: (v) => samples(strings(v), (text) => ({ text }), (text) => [...text.toLowerCase()].filter((c) => "aeiou".includes(c)).length)
  },
  {
    title: "Espejo de palabra", slug: "word-mirror", topics: ["String", "Two Pointers"], difficulty: "easy",
    description: "Indica si el texto es un palindromo despues de ignorar espacios y mayusculas.", output: "JSON boolean",
    cases: (v) => samples(["level", "Never odd or even", "codenix", strings(v)[3]], (text) => ({ text }), (text) => { const x = text.toLowerCase().replace(/[^a-z0-9]/g, ""); return x === [...x].reverse().join(""); })
  },
  {
    title: "Palabras en ruta", slug: "route-word-count", topics: ["String"], difficulty: "easy",
    description: "Cuenta las palabras separadas por uno o mas espacios.", output: "JSON number",
    cases: (v) => samples(["", "una ruta", "  dos   paradas ", strings(v)[2]], (text) => ({ text }), (text) => text.trim() ? text.trim().split(/\s+/).length : 0)
  },
  {
    title: "Invertir palabras", slug: "reverse-route-words", topics: ["String", "Stack"], difficulty: "easy",
    description: "Devuelve las palabras del texto en orden inverso y separadas por un solo espacio.", output: "JSON string",
    cases: (v) => samples(["sol luna", "  datos   y   rutas ", strings(v)[2]], (text) => ({ text }), (text) => text.trim().split(/\s+/).reverse().join(" "))
  },
  {
    title: "Primer faro unico", slug: "first-unique-character", topics: ["String", "Hash Table"], difficulty: "easy",
    description: "Devuelve el indice del primer caracter que aparece una sola vez, o -1.", output: "JSON number",
    cases: (v) => samples(["codenix", "aabb", "swiss", strings(v)[4]], (text) => ({ text }), (text) => { const counts = new Map<string, number>(); [...text].forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)); return [...text].findIndex((c) => counts.get(c) === 1); })
  },
  {
    title: "Frecuencia de señal", slug: "signal-frequency", topics: ["String", "Hash Table"], difficulty: "easy",
    description: "Devuelve un objeto con la frecuencia de cada caracter, respetando el orden de primera aparicion.", output: "JSON object",
    cases: (v) => samples(["aba", "codenix", strings(v)[0]], (text) => ({ text }), (text) => { const out: Record<string, number> = {}; [...text].forEach((c) => { out[c] = (out[c] ?? 0) + 1; }); return out; })
  },
  {
    title: "Subsecuencia de acceso", slug: "access-subsequence", topics: ["String", "Two Pointers"], difficulty: "easy",
    description: "Indica si pattern aparece como subsecuencia de text, manteniendo el orden.", output: "JSON boolean",
    cases: (v) => [{ data: { text: "codenix", pattern: "cnx" }, expected: true }, { data: { text: "codenix", pattern: "dex" }, expected: false }, { data: { text: strings(v)[0], pattern: "dx" }, expected: true }].map((x) => x),
  },
  {
    title: "Palabra mas larga", slug: "longest-route-word", topics: ["String"], difficulty: "easy",
    description: "Devuelve la palabra mas larga; en empate conserva la primera.", output: "JSON string",
    cases: (v) => samples(["red blue", "una ruta tranquila", strings(v)[2]], (text) => ({ text }), (text) => text.trim().split(/\s+/).reduce((best, word) => word.length > best.length ? word : best, ""))
  },
  {
    title: "Espacios limpios", slug: "clean-route-spaces", topics: ["String"], difficulty: "easy",
    description: "Elimina espacios al inicio y final y deja un solo espacio entre palabras.", output: "JSON string",
    cases: (v) => samples(["  hola   mundo ", "datos", `  codenix   ${v} `], (text) => ({ text }), (text) => text.trim().replace(/\s+/g, " "))
  },
  {
    title: "Cambio de mayusculas", slug: "toggle-message-case", topics: ["String"], difficulty: "easy",
    description: "Intercambia mayusculas y minusculas; los caracteres no alfabeticos no cambian.", output: "JSON string",
    cases: (v) => samples(["CoDe", "Data Structures", `Codenix-${v}`], (text) => ({ text }), (text) => [...text].map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(""))
  },
  {
    title: "Compresion de paquetes", slug: "packet-run-compression", topics: ["String", "Two Pointers"], difficulty: "medium",
    description: "Comprime grupos consecutivos como caracter seguido de cantidad, por ejemplo aaabb -> a3b2.", output: "JSON string",
    cases: (v) => samples(["aaabb", "abcd", `cc${v}xx`], (text) => ({ text }), (text) => { let out = ""; for (let i = 0; i < text.length;) { let j = i; while (j < text.length && text[j] === text[i]) j++; out += text[i] + (j - i); i = j; } return out; })
  }
];

const matrixOps: Operation[] = [
  {
    title: "Totales por fila", slug: "matrix-row-totals", topics: ["Matrix", "Array"], difficulty: "easy",
    description: "Devuelve la suma de cada fila de una matriz rectangular.", output: "JSON number[]",
    cases: (v) => samples(matrix(v), (grid) => ({ grid }), (grid) => grid.map((row) => row.reduce((a, b) => a + b, 0)))
  },
  {
    title: "Totales por columna", slug: "matrix-column-totals", topics: ["Matrix", "Array"], difficulty: "easy",
    description: "Devuelve la suma de cada columna de una matriz rectangular.", output: "JSON number[]",
    cases: (v) => samples(matrix(v), (grid) => ({ grid }), (grid) => grid[0].map((_, col) => grid.reduce((sum, row) => sum + row[col], 0)))
  },
  {
    title: "Diagonal principal", slug: "matrix-main-diagonal", topics: ["Matrix"], difficulty: "easy",
    description: "Suma los valores de la diagonal principal de una matriz cuadrada.", output: "JSON number",
    cases: (v) => samples([[[1, 2], [3, 4]], [[v, 0, 1], [2, 3, 4], [5, 6, 7]], [[-1, 8], [6, 2]]], (grid) => ({ grid }), (grid) => grid.reduce((sum, row, i) => sum + row[i], 0))
  },
  {
    title: "Transpuesta de panel", slug: "panel-transpose", topics: ["Matrix"], difficulty: "medium",
    description: "Devuelve la matriz transpuesta sin modificar la entrada.", output: "JSON number[][]",
    cases: (v) => samples([[[1, 2, 3], [4, 5, 6]], matrix(v)[1], [[7, 8], [9, 10], [11, 12]]], (grid) => ({ grid }), (grid) => grid[0].map((_, c) => grid.map((row) => row[c])))
  },
  {
    title: "Luces encendidas", slug: "matrix-lit-cells", topics: ["Matrix", "Graph"], difficulty: "easy",
    description: "Cuenta las celdas cuyo valor es estrictamente mayor que cero.", output: "JSON number",
    cases: (v) => samples(matrix(v), (grid) => ({ grid }), (grid) => grid.flat().filter((x) => x > 0).length)
  }
];

const mathOps: Operation[] = [
  {
    title: "Maximo comun divisor", slug: "gcd-beacons", topics: ["Math"], difficulty: "easy",
    description: "Calcula el maximo comun divisor de a y b usando valores no negativos.", output: "JSON number",
    cases: (v) => samples([[18, 24], [7, 13], [v + 6, v + 9]], ([a, b]) => ({ a, b }), ([a, b]) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); })
  },
  {
    title: "Minimo comun multiplo", slug: "lcm-beacons", topics: ["Math"], difficulty: "easy",
    description: "Calcula el minimo comun multiplo positivo de a y b.", output: "JSON number",
    cases: (v) => samples([[4, 6], [7, 5], [v + 2, v + 4]], ([a, b]) => ({ a, b }), ([a, b]) => { const gcd = (x: number, y: number): number => y ? gcd(y, x % y) : Math.abs(x); return Math.abs(a * b) / gcd(a, b); })
  },
  {
    title: "Raiz digital", slug: "digital-root", topics: ["Math"], difficulty: "easy",
    description: "Suma repetidamente los digitos hasta obtener un solo digito.", output: "JSON number",
    cases: (v) => samples([0, 9, 38, 999, v * 111 + 7], (number) => ({ number }), (number) => { let x = number; while (x >= 10) x = String(x).split("").reduce((s, d) => s + Number(d), 0); return x; })
  },
  {
    title: "Detector de primos", slug: "prime-detector", topics: ["Math", "Number Theory"], difficulty: "easy",
    description: "Indica si n es un numero primo mayor que uno.", output: "JSON boolean",
    cases: (v) => samples([1, 2, 3, 4, 17 + v], (n) => ({ n }), (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; })
  },
  {
    title: "Suma de digitos", slug: "digit-sum", topics: ["Math"], difficulty: "easy",
    description: "Devuelve la suma de los digitos decimales de un entero no negativo.", output: "JSON number",
    cases: (v) => samples([0, 42, 1005, v * 123 + 8], (n) => ({ n }), (n) => String(n).split("").reduce((s, d) => s + Number(d), 0))
  }
];

const operations = [...arrayOps, ...stringOps, ...matrixOps, ...mathOps];
const contexts = ["del laboratorio", "del archivo", "de la nave", "del mapa"];

function buildProblem(operation: Operation, index: number): ProblemSeed {
  const variant = Math.floor(index / operations.length) + 1;
  const context = contexts[(index - 1) % contexts.length];
  const cases = operation.cases(variant);
  return {
    numericId: index + 2,
    title: `${operation.title} ${context} ${variant}`,
    slug: `${operation.slug}-${context.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${variant}`,
    difficulty: operation.difficulty,
    statement: `## Mision\n\n${operation.description} Resuelve el desafio ${context} ${variant} usando el objeto JSON recibido.\n\n## Restricciones\n\n- Los datos cumplen el formato indicado.\n- La salida debe ser un JSON valido.\n- Evita depender de red o de archivos externos.`,
    inputFormat: "JSON object containing the fields described in the statement.",
    outputFormat: operation.output,
    constraints: "Input sizes are bounded by the provided tests; preserve the required output type.",
    parameters: [{ name: "data", type: "object", description: "JSON payload for the challenge." }],
    outputType: operation.output,
    topics: operation.topics,
    examples: cases.slice(0, 2).map((testcase) => ({
      input: JSON.stringify(testcase.data),
      output: JSON.stringify(testcase.expected),
      explanation: "El resultado se obtiene aplicando la regla descrita a los datos de entrada."
    })),
    testcases: cases.map((testcase, caseIndex) => ({
      input: JSON.stringify(testcase.data),
      expectedOutput: JSON.stringify(testcase.expected),
      visibility: caseIndex < 2 ? "sample" : "hidden"
    })),
    starterCode: STARTER_CODE
  };
}

export const GENERATED_PROBLEMS: ProblemSeed[] = Array.from(
  { length: 148 },
  (_, offset) => buildProblem(operations[offset % operations.length], offset + 1)
);
