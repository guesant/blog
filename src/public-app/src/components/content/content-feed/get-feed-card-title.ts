import type { FeedCardProps } from './feed-card-types';
import { getFeedCardCategoryLabel } from './feed-card-category-label';

export function getFeedCardTitle(props: FeedCardProps) {
  if (props.entry.kind !== 'achado') {
    return props.entry.title;
  }

  const category = props.entry.findingType
    ? getFeedCardCategoryLabel({ entry: props.entry, t: props.t })
    : undefined;

  return category ? `[${category}] | ${props.entry.title}` : props.entry.title;
}
