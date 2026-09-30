import { Box, FindingCardKindChip, FindingCardMetadataRow } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { formatDate } from '../format-date';
import type { AchadosTranslationKey } from '@/i18n/compat-support';
import { FeedCardTags } from './feed-card-tags';
import { EditorialFeedCardMetadata } from './editorial-feed-card-metadata';
import { TraditionalFeedCardMetadata } from './traditional-feed-card-metadata';

type FeedCardHeaderProps = Pick<
  FeedCardProps,
  'entry' | 'locale' | 't' | 'onQuickFilter' | 'flatCards'
>;

export function FeedCardHeader(props: FeedCardHeaderProps) {
  const kindMessageKey: AchadosTranslationKey = (
    {
      achado: 'finding',
      post: 'writing',
      colecao: 'collection',
    } as const
  )[props.entry.kind];

  const metadata = [formatDate(props.entry.date, props.locale), props.entry.readingTime]
    .filter(Boolean)
    .join(' · ');

  const metadataRow = (
    <FindingCardMetadataRow>
      <FindingCardKindChip
        clickable={Boolean(props.onQuickFilter)}
        onClick={() => props.onQuickFilter?.({ kind: props.entry.kind })}
      >
        {props.t(kindMessageKey)}
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
