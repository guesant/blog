import { toMessageKey } from '@portfolio/data/config/achados';
import type { AchadosTranslator } from '@/i18n/compat-support';

export function stateLabel(value: string, t: AchadosTranslator): string {
  const key = toMessageKey(value);

  return t(`consumptionStates.${key}`);
}
