import type { FeedCardProps } from './feed-card-types';
import { EditorialFeedCardFooter } from './editorial-feed-card-footer';
import { TraditionalFeedCardFooter } from './traditional-feed-card-footer';

type FeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't' | 'flatCards'>;

export function FeedCardFooter(props: FeedCardFooterProps) {
  return props.flatCards ? (
    <EditorialFeedCardFooter entry={props.entry} t={props.t} />
  ) : (
    <TraditionalFeedCardFooter entry={props.entry} t={props.t} />
  );
}
