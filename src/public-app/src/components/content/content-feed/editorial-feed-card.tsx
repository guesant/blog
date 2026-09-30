import { EditorialFeedItemFrame } from '../../ui';
import type { FeedCardProps } from './feed-card-types';
import { FeedCardBody } from './feed-card-body';

type EditorialFeedCardProps = FeedCardProps;

export function EditorialFeedCard(props: EditorialFeedCardProps) {
  return (
    <EditorialFeedItemFrame component="article">
      <FeedCardBody {...props} />
    </EditorialFeedItemFrame>
  );
}
