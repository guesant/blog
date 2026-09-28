import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';
import { AchadoDetailContent5Text } from '../../ui/semantic/AchadoDetailContent5Text';
import { AchadoDetailContent6Text } from '../../ui/semantic/AchadoDetailContent6Text';

type AchadoNotesSectionProps = {
  item: Reference;
  t: AchadosTranslator;
};

export function AchadoNotesSection(props: AchadoNotesSectionProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.item.personalNote)}
        content={
          <FindingSection title={props.t('personalNote')}>
            <AchadoDetailContent5Text>{props.item.personalNote}</AchadoDetailContent5Text>
          </FindingSection>
        }
      />
      <ConditionalContent
        condition={Boolean(props.item.reasonFound)}
        content={
          <FindingSection title={props.t('whyItWasSaved')}>
            <AchadoDetailContent6Text>{props.item.reasonFound}</AchadoDetailContent6Text>
          </FindingSection>
        }
      />
    </>
  );
}
