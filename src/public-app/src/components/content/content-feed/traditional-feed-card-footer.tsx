import { FindingCardFooterFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardFooterContent } from './feed-card-footer-content';

type TraditionalFeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't'>;

export function TraditionalFeedCardFooter(props: TraditionalFeedCardFooterProps) {
  return (
    <FindingCardFooterFrame>
      <FeedCardFooterContent {...props} />
    </FindingCardFooterFrame>
  );
}
