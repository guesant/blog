import { Box, FindingCardKindChip, FindingCardMetadataRow } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { formatDate } from '../format-date';
import type { AchadosTranslationKey } from '@/i18n/compat-support';
import { FeedCardTags } from './feed-card-tags';
import { EditorialFeedCardMetadata } from './editorial-feed-card-metadata';
import { TraditionalFeedCardMetadata } from './traditional-feed-card-metadata';

const kindMessageKeys = {
  achado: 'finding',
  post: 'writing',
  colecao: 'collection',
} as const satisfies Record<FeedCardProps['entry']['kind'], AchadosTranslationKey>;

type FeedCardHeaderProps = Pick<
  FeedCardProps,
  'entry' | 'locale' | 't' | 'onQuickFilter' | 'flatCards'
>;

export function FeedCardHeader(props: FeedCardHeaderProps) {
  const metadata = [formatDate(props.entry.date, props.locale), props.entry.readingTime]
    .filter(Boolean)
    .join(' · ');

  const kindLabel = props.t(kindMessageKeys[props.entry.kind]);

  const metadataRow = (
    <FindingCardMetadataRow>
      <FindingCardKindChip
        aria-label={kindLabel}
        clickable={Boolean(props.onQuickFilter)}
        onClick={() => props.onQuickFilter?.({ kind: props.entry.kind })}
        title={kindLabel}
      >
        {kindLabel}
      </FindingCardKindChip>
      <Box component="span">{metadata}</Box>
    </FindingCardMetadataRow>
  );

  return props.flatCards ? (
    <EditorialFeedCardMetadata
      metadata={metadataRow}
      tags={<FeedCardTags entry={props.entry} t={props.t} />}
    />
  ) : (
    <TraditionalFeedCardMetadata metadata={metadataRow} />
  );
}
