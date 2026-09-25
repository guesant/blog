import type { Translator } from '@/i18n/compat-support';
import { CollectionListing } from '../../content/collection-listing';
import type { CreditEntry } from './types';
import { CreditCard } from './credit-card';

type CreditsListProps = {
  entries: CreditEntry[];
  t: Translator;
};

export function CreditsList(props: CreditsListProps) {
  return (
    <CollectionListing
      items={props.entries}
      getKey={(entry) => `${entry.category}-${entry.url}-${entry.name}`}
      renderListItem={(entry) => <CreditCard entry={entry} t={props.t} />}
    />
  );
}
