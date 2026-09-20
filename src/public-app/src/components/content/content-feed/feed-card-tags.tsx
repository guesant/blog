import type { FeedCardProps } from './feed-card-types';
import { FeedCardTagItems } from './feed-card-tag-items';

type FeedCardTagsProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardTags(props: FeedCardTagsProps) {
  return <FeedCardTagItems entry={props.entry} t={props.t} />;
}
