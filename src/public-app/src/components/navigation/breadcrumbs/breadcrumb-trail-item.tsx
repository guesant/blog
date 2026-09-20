'use client';

import type { BreadcrumbItem } from './types';
import { BreadcrumbCurrentItem } from './breadcrumb-current-item';
import { BreadcrumbLinkItem } from './breadcrumb-link-item';

type BreadcrumbTrailItemProps = { item: BreadcrumbItem };

export function BreadcrumbTrailItem(props: BreadcrumbTrailItemProps) {
  if (props.item.href) {
    return <BreadcrumbLinkItem item={props.item} />;
  }
  return <BreadcrumbCurrentItem item={props.item} />;
}
