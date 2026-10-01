import { Box, FindingCardMetadataRow } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { formatDate } from '../format-date';

type FeedCardHeaderProps = Pick<FeedCardProps, 'entry' | 'locale'>;

export function FeedCardHeader(props: FeedCardHeaderProps) {
  const metadata = [formatDate(props.entry.date, props.locale), props.entry.readingTime]
    .filter(Boolean)
    .join(' · ');

  return (
    <FindingCardMetadataRow>
      <Box component="span">{metadata}</Box>
    </FindingCardMetadataRow>
  );
}
