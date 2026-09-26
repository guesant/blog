import { Box, Chip } from '../../ui';
import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';
import { toMessageKey } from '@portfolio/data/config/achados';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTopics } from './feed-card-topics';

type FeedCardTagItemsProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardTagItems(props: FeedCardTagItemsProps) {
  return (
    <Box visualVariant="feedCard2">
      <ConditionalContent
        condition={Boolean(props.entry.findingType)}
        content={
          <Chip
            label={props.t(`types.${toMessageKey(props.entry.findingType ?? '')}`)}
            size="small"
          />
        }
      />
      <ConditionalContent
        condition={Boolean(props.entry.popularityLabel)}
        content={
          <Chip
            label={props.entry.popularityLabel ?? ''}
            size="small"
            icon={<Icon name="star" size={14} />}
          />
        }
      />
      <ConditionalContent
        condition={Boolean(props.entry.featured)}
        content={<Chip label={props.t('featured')} size="small" color="info" />}
      />
      <FeedCardTopics topics={props.entry.topics} />
    </Box>
  );
}
