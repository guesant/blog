import type { BreadcrumbItem } from './types';
import { BreadcrumbTrailItemText } from '../../ui/semantic/BreadcrumbTrailItemText';

type BreadcrumbCurrentItemProps = { item: BreadcrumbItem };

export function BreadcrumbCurrentItem(props: BreadcrumbCurrentItemProps) {
  return (
    <BreadcrumbTrailItemText variant="body2" color="text.primary" aria-current="page">
      {props.item.label}
    </BreadcrumbTrailItemText>
  );
}
