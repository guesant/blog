import type { FeedCardProps } from './feed-card-types';
import { EditorialFeedCard } from './editorial-feed-card';
import { TraditionalFeedCard } from './traditional-feed-card';

export function FeedCard(props: FeedCardProps) {
  return props.flatCards ? <EditorialFeedCard {...props} /> : <TraditionalFeedCard {...props} />;
}
