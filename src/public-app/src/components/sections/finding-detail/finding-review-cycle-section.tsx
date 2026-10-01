import type { DetailEntry } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingFactSection } from './finding-fact-section';

type FindingReviewCycleSectionProps = {
  entries: DetailEntry[];
  t: AchadosTranslator;
};

export function FindingReviewCycleSection(props: FindingReviewCycleSectionProps) {
  return <FindingFactSection entries={props.entries} title={props.t('cycle')} />;
}
