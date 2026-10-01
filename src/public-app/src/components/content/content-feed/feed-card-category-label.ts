import { toMessageKey } from '@portfolio/data/config/achados';
import type { FeedCardProps } from './feed-card-types';

type FeedCardCategoryLabelProps = Pick<FeedCardProps, 'entry' | 't'>;

export function getFeedCardCategoryLabel(props: FeedCardCategoryLabelProps) {
  return props.t(`types.${toMessageKey(props.entry.findingType ?? '')}`);
}
