import { EditorialFeedItemFooterFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardTags } from './feed-card-tags';

type EditorialFeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't'>;

export function EditorialFeedCardFooter(props: EditorialFeedCardFooterProps) {
  return (
    <EditorialFeedItemFooterFrame>
      <FeedCardTags entry={props.entry} t={props.t} />
    </EditorialFeedItemFooterFrame>
  );
}
