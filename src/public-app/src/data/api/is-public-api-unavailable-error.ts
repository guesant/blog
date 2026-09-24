export function isPublicApiUnavailableError(error: unknown): boolean {
  const serialized = `${String(error)} ${JSON.stringify(error) ?? ''}`;

  return (
    /(?:TypeError|AbortError)/.test(serialized) || /"status":(?:502|503|504)\b/.test(serialized)
  );
}
