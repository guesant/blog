import type { useTranslations } from '@/i18n/compat';
import type { CreditsPageContent as CreditsContent } from '@portfolio/data/domain/types';
import { CreditsAcknowledgements } from './credits-acknowledgements';
import { CreditsInfrastructure } from './credits-infrastructure';
import { CreditsReferences } from './credits-references';
import { CreditsSection } from './credits-section';
import { PackageList } from './package-list';
import { CollectionPagination } from '../../content/collection-pagination';

type CreditsPageSectionsProps = {
  content: CreditsContent;
  t: ReturnType<typeof useTranslations>;
};

export function CreditsPageSections(props: CreditsPageSectionsProps) {
  const groups = props.content.credits.groups;

  return (
    <>
      <CollectionPagination meta={props.content.credits.meta} action="/credits" />
      <CreditsAcknowledgements entries={groups.acknowledgements} heading={props.t('eyebrow')} />
      <CreditsReferences entries={groups.references} heading={props.t('referencesHeading')} />
      <CreditsInfrastructure
        entries={groups.infrastructure}
        heading={props.t('infrastructureHeading')}
      />
      <CreditsSection heading={props.t('librariesHeading')} maxWidth="none">
        <PackageList packages={props.content.libraries} />
      </CreditsSection>
      <CreditsSection heading={props.t('toolsHeading')} maxWidth="none">
        <PackageList packages={props.content.tools} />
      </CreditsSection>
    </>
  );
}
