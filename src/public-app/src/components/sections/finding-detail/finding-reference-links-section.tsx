import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { LinkSectionContent } from './link-section-content';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';

type FindingReferenceLinksSectionProps = {
  item: Reference;
  t: AchadosTranslator;
};

export function FindingReferenceLinksSection(props: FindingReferenceLinksSectionProps) {
  return (
    <ConditionalContent
      condition={props.item.links.length > 0}
      content={
        <FindingSection title={props.t('linksHeading')}>
          <LinkSectionContent item={props.item} t={props.t} />
        </FindingSection>
      }
    />
  );
}
