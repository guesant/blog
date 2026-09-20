export function slugFromKey(value: unknown): string {
  const slug = String(value ?? '');

  return /^[0-9a-f]{6}-/.test(slug) ? slug.slice(7) : slug;
}
