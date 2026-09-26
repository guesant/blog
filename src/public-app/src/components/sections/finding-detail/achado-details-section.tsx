import type { DetailEntry } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingFactSection } from './finding-fact-section';

type AchadoDetailsSectionProps = {
  entries: DetailEntry[];
  t: AchadosTranslator;
};

export function AchadoDetailsSection(props: AchadoDetailsSectionProps) {
  return <FindingFactSection entries={props.entries} title={props.t('detailsHeading')} />;
}
