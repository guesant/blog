export function fallbackValue<T>(value: T | undefined, fallback: T): T {
  return value ?? fallback;
}
