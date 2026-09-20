import type { FeedCardProps } from './feed-card-types';
import { FeedCardContent } from './feed-card-content';
import { FeedCardFooter } from './feed-card-footer';
import { FeedCardHeader } from './feed-card-header';
import { FeedCardSourcePreviews } from './feed-card-source-previews';

type FeedCardBodyProps = FeedCardProps;

export function FeedCardBody(props: FeedCardBodyProps) {
  return (
    <>
      <FeedCardHeader {...props} />
      <FeedCardContent {...props} />
      <FeedCardSourcePreviews {...props} />
      <FeedCardFooter {...props} />
    </>
  );
}
