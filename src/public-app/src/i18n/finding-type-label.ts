import { toMessageKey } from '@portfolio/data/config/achados';

type FindingTypeTranslator = (key: `types.${string}`) => string;

export function findingTypeLabel(
  type: string | undefined,
  t: FindingTypeTranslator,
): string | undefined {
  if (!type) {
    return undefined;
  }

  return t(`types.${toMessageKey(type)}`);
}
