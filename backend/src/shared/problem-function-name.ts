export function getProblemFunctionName(slug: string) {
  const parts = slug.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const [first, ...rest] = parts;
  const name = [first, ...rest.map((part) => part.charAt(0).toUpperCase() + part.slice(1))]
    .filter(Boolean)
    .join('');

  return /^[A-Za-z_$]/.test(name) ? name : `solve${name}`;
}
