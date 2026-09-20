export function jsonToCsv(value: string) {
  const data = JSON.parse(value) as Record<string, unknown>[];

  if (!Array.isArray(data) || data.length === 0) return '';

  const keys = [...new Set(data.flatMap((item) => Object.keys(item)))];

  const cell = (item: unknown) => `"${String(item ?? '').replaceAll('"', '""')}"`;

  return [keys.join(','), ...data.map((item) => keys.map((key) => cell(item[key])).join(','))].join(
    '\n',
  );
}
