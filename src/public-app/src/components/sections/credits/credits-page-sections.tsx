import type { useTranslations } from '@/i18n/compat';
import type { CreditsPageContent as CreditsContent } from '@portfolio/data/domain/types';
import { CollectionPagination } from '../../content/collection-pagination';
import { CreditsList } from './credits-list';

type CreditsPageSectionsProps = {
  content: CreditsContent;
  t: ReturnType<typeof useTranslations>;
};

export function CreditsPageSections(props: CreditsPageSectionsProps) {
  return (
    <>
      <CreditsList entries={props.content.credits.entries} t={props.t} />
      <CollectionPagination meta={props.content.credits.meta} action="/credits" />
    </>
  );
}
