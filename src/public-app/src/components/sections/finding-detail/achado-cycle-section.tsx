import type { DetailEntry } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingFactSection } from './finding-fact-section';

type AchadoCycleSectionProps = {
  entries: DetailEntry[];
  t: AchadosTranslator;
};

export function AchadoCycleSection(props: AchadoCycleSectionProps) {
  return <FindingFactSection entries={props.entries} title={props.t('cycle')} />;
}
