import { EditorialFeedItemFooterFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardFooterContent } from './feed-card-footer-content';

type EditorialFeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't'>;

export function EditorialFeedCardFooter(props: EditorialFeedCardFooterProps) {
  return (
    <EditorialFeedItemFooterFrame>
      <FeedCardFooterContent {...props} />
    </EditorialFeedItemFooterFrame>
  );
}
