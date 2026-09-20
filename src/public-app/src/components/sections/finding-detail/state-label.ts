import { toMessageKey } from '@portfolio/data/config/achados';

export function stateLabel(value: string, t: (key: string) => string): string {
  const key = toMessageKey(value);

  return t(`consumptionStates.${key}`);
}
