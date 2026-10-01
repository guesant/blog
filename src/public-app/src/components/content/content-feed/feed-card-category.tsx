import { Chip } from '../../ui';
import { toMessageKey } from '@portfolio/data/config/achados';
import type { FeedCardProps } from './feed-card-types';

type FeedCardCategoryProps = Pick<FeedCardProps, 'entry' | 't'>;

export function FeedCardCategory(props: FeedCardCategoryProps) {
  return (
    <Chip label={props.t(`types.${toMessageKey(props.entry.findingType ?? '')}`)} size="small" />
  );
}
