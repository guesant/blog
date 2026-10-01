import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';
import { FindingPersonalNoteText } from '../../ui/semantic/FindingPersonalNoteText';
import { FindingReasonFoundText } from '../../ui/semantic/FindingReasonFoundText';

type FindingNotesSectionProps = {
  item: Reference;
  t: AchadosTranslator;
};

export function FindingNotesSection(props: FindingNotesSectionProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.item.personalNote)}
        content={
          <FindingSection title={props.t('personalNote')}>
            <FindingPersonalNoteText>{props.item.personalNote}</FindingPersonalNoteText>
          </FindingSection>
        }
      />
      <ConditionalContent
        condition={Boolean(props.item.reasonFound)}
        content={
          <FindingSection title={props.t('whyItWasSaved')}>
            <FindingReasonFoundText>{props.item.reasonFound}</FindingReasonFoundText>
          </FindingSection>
        }
      />
    </>
  );
}
