import { FindingCardKindChip } from '../../ui';
import { CatalogCard } from '../../content/catalog-card';
import { CatalogEntrySummary } from '../../content/catalog-entry-summary';
import { CreditEntryTitle } from './credit-entry-title';
import type { CreditEntry } from './types';

type CreditCardProps = {
  entry: CreditEntry;
};

export function CreditCard(props: CreditCardProps) {
  return (
    <CatalogCard>
      <CatalogEntrySummary
        meta={<FindingCardKindChip>{props.entry.category}</FindingCardKindChip>}
        title={<CreditEntryTitle entry={props.entry} />}
        description={props.entry.description}
        titleVariant={props.entry.url ? 'h5' : 'h3'}
        descriptionLayout="reference"
      />
    </CatalogCard>
  );
}
