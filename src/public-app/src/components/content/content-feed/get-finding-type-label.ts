import type { AchadosTranslator } from '@/i18n/compat-support';
import { findingTypeLabel } from '@/i18n/finding-type-label';

type FindingTypeLabelProps = {
  findingType?: string;
  t: AchadosTranslator;
};

export function getFindingTypeLabel(props: FindingTypeLabelProps): string | undefined {
  return findingTypeLabel(props.findingType, props.t);
}
