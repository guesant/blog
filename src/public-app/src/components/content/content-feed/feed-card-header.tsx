import { Box, ContentDateLabel, FindingCardMetadataRow } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { formatDate } from '../format-date';
import { ConditionalContent } from '../../primitives/conditional-content';

type FeedCardHeaderProps = Pick<FeedCardProps, 'entry' | 'locale'>;

export function FeedCardHeader(props: FeedCardHeaderProps) {
  const date = formatDate(props.entry.date, props.locale);

  const readingTime = props.entry.readingTime;

  return (
    <FindingCardMetadataRow>
      <ConditionalContent
        condition={Boolean(date)}
        content={<ContentDateLabel>{date}</ContentDateLabel>}
      />
      <ConditionalContent
        condition={Boolean(date && readingTime)}
        content={<Box component="span">·</Box>}
      />
      <ConditionalContent
        condition={Boolean(readingTime)}
        content={<Box component="span">{readingTime}</Box>}
      />
    </FindingCardMetadataRow>
  );
}
