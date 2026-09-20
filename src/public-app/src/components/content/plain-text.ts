export function plainText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(plainText).filter(Boolean).join(' ');
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    return [record.text, record.value, record.children].map(plainText).filter(Boolean).join(' ');
  }
  return '';
}
