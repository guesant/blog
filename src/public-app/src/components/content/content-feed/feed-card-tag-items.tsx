import { FindingCardTagListFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTopics } from './feed-card-topics';

type FeedCardTagItemsProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardTagItems(props: FeedCardTagItemsProps) {
  return (
    <FindingCardTagListFrame>
      <FeedCardTopics topics={props.entry.topics} />
    </FindingCardTagListFrame>
  );
}
