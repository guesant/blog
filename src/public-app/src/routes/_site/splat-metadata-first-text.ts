export function firstText(
  primary: string | undefined,
  secondary: string,
  fallback: string,
): string {
  return primary || secondary || fallback;
}
