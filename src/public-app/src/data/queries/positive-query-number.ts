export function positiveQueryNumber(value: string | null): number | undefined {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : undefined;
}
