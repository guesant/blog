export function withoutHiddenItems<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item) => !item || typeof item !== 'object' || !('hidden' in item) || item.hidden !== true,
      )
      .map((item) => withoutHiddenItems(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withoutHiddenItems(item)]),
    ) as T;
  }

  return value;
}

export function isHidden<T>(value: T): boolean {
  return Boolean(value && typeof value === 'object' && 'hidden' in value && value.hidden === true);
}
