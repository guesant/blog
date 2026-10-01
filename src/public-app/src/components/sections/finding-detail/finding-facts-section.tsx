import type { DetailEntry } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingFactSection } from './finding-fact-section';

type FindingFactsSectionProps = {
  entries: DetailEntry[];
  t: AchadosTranslator;
};

export function FindingFactsSection(props: FindingFactsSectionProps) {
  return <FindingFactSection entries={props.entries} title={props.t('detailsHeading')} />;
}
