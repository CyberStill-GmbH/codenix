/**
 * Compares the actual output with the expected output.
 * Normalizes trailing whitespaces on each line and removes trailing newlines.
 */
export function compareOutput(actual: string, expected: string | null | undefined): boolean {
  const actualNorm = normalize(actual || "");
  const expectedNorm = normalize(expected || "");
  
  return actualNorm === expectedNorm;
}

function normalize(s: string): string {
  return s
    .trim()
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n');
}
