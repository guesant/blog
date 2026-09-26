import type { CreditsTranslator, TranslationKey } from '@/i18n/compat-support';
import { Chip, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import { CatalogCard } from '../../content/catalog-card';
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
      <Chip label={category} size="small" visualVariant="feedCardKind" />
      <ConditionalContent
        condition={Boolean(props.entry.url)}
        content={
          <ExternalLink href={props.entry.url} visualVariant="creditEntryItem">
            {props.entry.name}
          </ExternalLink>
        }
      />
      <ConditionalContent
        condition={!props.entry.url}
        content={<Typography variant="h3">{props.entry.name}</Typography>}
      />
      <ConditionalContent
        condition={Boolean(props.entry.description)}
        content={
          <Typography color="text.secondary" visualVariant="referenceCardDescription">
            {props.entry.description}
          </Typography>
        }
      />
    </CatalogCard>
  );
}
