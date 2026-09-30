import { FindingFeedCardFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardBody } from './feed-card-body';

type TraditionalFeedCardProps = FeedCardProps;

export function TraditionalFeedCard(props: TraditionalFeedCardProps) {
  return (
    <FindingFeedCardFrame component="article">
      <FeedCardBody {...props} />
    </FindingFeedCardFrame>
  );
}
