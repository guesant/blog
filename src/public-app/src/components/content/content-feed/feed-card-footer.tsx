import type { FeedCardProps } from './feed-card-types';
import { TraditionalFeedCardFooter } from './traditional-feed-card-footer';
import { FeedCardExternalLink } from './feed-card-external-link';

type FeedCardFooterProps = Pick<FeedCardProps, 'entry' | 't' | 'flatCards'>;

export function FeedCardFooter(props: FeedCardFooterProps) {
  return props.flatCards ? (
    <FeedCardExternalLink entry={props.entry} t={props.t} />
  ) : (
    <TraditionalFeedCardFooter entry={props.entry} t={props.t} />
  );
}
