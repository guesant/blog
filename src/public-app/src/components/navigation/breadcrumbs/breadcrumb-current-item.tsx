import type { BreadcrumbItem } from './types';
import { BreadcrumbCurrentItemContent } from '../../ui/semantic/BreadcrumbCurrentItemContent';

type BreadcrumbCurrentItemProps = { item: BreadcrumbItem };

export function BreadcrumbCurrentItem(props: BreadcrumbCurrentItemProps) {
  return <BreadcrumbCurrentItemContent {...props.item} />;
}
