import { Typography } from '../../ui';
import type { BreadcrumbItem } from './types';

type BreadcrumbCurrentItemProps = { item: BreadcrumbItem };

export function BreadcrumbCurrentItem(props: BreadcrumbCurrentItemProps) {
  return (
    <Typography
      variant="body2"
      color="text.primary"
      aria-current="page"
      visualVariant="breadcrumbTrailItem"
    >
      {props.item.label}
    </Typography>
  );
}
