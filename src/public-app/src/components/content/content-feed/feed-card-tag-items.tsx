import { Chip, FindingCardTagListFrame } from '../../ui';
import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTopics } from './feed-card-topics';

type FeedCardTagItemsProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardTagItems(props: FeedCardTagItemsProps) {
  return (
    <FindingCardTagListFrame>
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
    </FindingCardTagListFrame>
  );
}
