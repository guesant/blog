import type { Reference } from '@portfolio/data/domain/types';
import type { useTranslations } from '@/i18n/compat';
import { LinkSectionContent } from './link-section-content';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';

type AchadoLinksSectionProps = {
  item: Reference;
  t: ReturnType<typeof useTranslations>;
};

export function AchadoLinksSection(props: AchadoLinksSectionProps) {
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
