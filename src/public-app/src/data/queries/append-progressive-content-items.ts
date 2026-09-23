export function appendProgressiveContentItems<T>(pages: T[][], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();

  return pages.flatMap((items) =>
    items.filter((item) => {
      const key = getKey(item);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    }),
  );
}
