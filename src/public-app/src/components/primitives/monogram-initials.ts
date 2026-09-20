export function monogramInitials(label: string): string {
  const alphanumeric = label.replace(/[^\p{L}\p{N}]/gu, '');

  return alphanumeric.slice(0, 2).toUpperCase();
}
