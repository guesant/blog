import { Typography } from '../../ui';
import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';

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
            <Typography visualVariant="achadoDetailContent5">{props.item.personalNote}</Typography>
          </FindingSection>
        }
      />
      <ConditionalContent
        condition={Boolean(props.item.reasonFound)}
        content={
          <FindingSection title={props.t('whyItWasSaved')}>
            <Typography visualVariant="achadoDetailContent6">{props.item.reasonFound}</Typography>
          </FindingSection>
        }
      />
    </>
  );
}
