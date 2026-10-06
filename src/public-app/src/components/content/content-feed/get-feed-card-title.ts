import type { FeedCardProps } from './feed-card-types';
import { findingVisualTitle } from '@/i18n/finding-visual-title';
import { getFindingTypeLabel } from './get-finding-type-label';

export function getFeedCardTitle(props: FeedCardProps) {
  if (props.entry.kind !== 'achado') {
    return props.entry.title;
  }

  const category = getFindingTypeLabel({ findingType: props.entry.findingType, t: props.t });

  return findingVisualTitle({ title: props.entry.title, typeLabel: category });
}
