import type { CreditsPageContent as CreditsContent } from '@portfolio/data/domain/types';
import { CollectionPagination } from '../../content/collection-pagination';
import { CreditsList } from './credits-list';

type CreditsPageSectionsProps = {
  content: CreditsContent;
};

export function CreditsPageSections(props: CreditsPageSectionsProps) {
  return (
    <>
      <CreditsList entries={props.content.credits.entries} />
      <CollectionPagination meta={props.content.credits.meta} action="/credits" />
    </>
  );
}
