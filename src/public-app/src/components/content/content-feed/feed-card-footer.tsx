import type { FeedCardProps } from './feed-card-types';
import { TraditionalFeedCardFooter } from './traditional-feed-card-footer';

type FeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't' | 'flatCards'>;

export function FeedCardFooter(props: FeedCardFooterProps) {
  return props.flatCards ? null : <TraditionalFeedCardFooter entry={props.entry} t={props.t} />;
}
