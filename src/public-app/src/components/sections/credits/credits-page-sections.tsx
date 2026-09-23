import type { useTranslations } from '@/i18n/compat';
import type { CreditsPageContent as CreditsContent } from '@portfolio/data/domain/types';
import { CreditsEntrySection } from './credits-entry-section';
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
      <CreditsEntrySection entries={groups.acknowledgements} heading={props.t('eyebrow')} />
      <CreditsReferences entries={groups.references} heading={props.t('referencesHeading')} />
      <CreditsEntrySection
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
