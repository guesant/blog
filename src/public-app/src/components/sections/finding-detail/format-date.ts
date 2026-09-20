export function formatDate(value: string, locale: string): string | undefined {
  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
