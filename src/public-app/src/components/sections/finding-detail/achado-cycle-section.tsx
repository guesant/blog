import type { DetailEntry } from './types';
import type { useTranslations } from '@/i18n/compat';
import { FactGrid } from './fact-grid';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';

type AchadoCycleSectionProps = {
  entries: DetailEntry[];
  t: ReturnType<typeof useTranslations>;
};

export function AchadoCycleSection(props: AchadoCycleSectionProps) {
  return (
    <ConditionalContent
      condition={props.entries.length > 0}
      content={
        <FindingSection title={props.t('cycle')}>
          <FactGrid entries={props.entries} />
        </FindingSection>
      }
    />
  );
}
