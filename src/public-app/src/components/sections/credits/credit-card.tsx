import type { CreditsTranslator, TranslationKey } from '@/i18n/compat-support';
import { Chip } from '../../ui';
import { CatalogCard } from '../../content/catalog-card';
import { CatalogEntrySummary } from '../../content/catalog-entry-summary';
import { CreditEntryTitle } from './credit-entry-title';
import type { CreditEntry } from './types';

type CreditCardProps = {
  entry: CreditEntry;
  t: CreditsTranslator;
};

const categoryMessageKeys: Record<string, TranslationKey<'Pages.credits'>> = {
  reference: 'categories.reference',
  infrastructure: 'categories.infrastructure',
  library: 'categories.library',
  font: 'categories.font',
  tool: 'categories.tool',
};

export function CreditCard(props: CreditCardProps) {
  const categoryMessageKey = categoryMessageKeys[props.entry.category];

  const category = categoryMessageKey ? props.t(categoryMessageKey) : props.entry.category;

  return (
    <CatalogCard>
      <CatalogEntrySummary
        meta={<Chip label={category} size="small" visualVariant="feedCardKind" />}
        title={<CreditEntryTitle entry={props.entry} />}
        description={props.entry.description}
        titleVariant={props.entry.url ? 'h5' : 'h3'}
        descriptionVisualVariant="referenceCardDescription"
      />
    </CatalogCard>
  );
}
