import type { BreadcrumbItem } from './types';
import { BreadcrumbCurrentItem } from './breadcrumb-current-item';
import { BreadcrumbLinkItem } from './breadcrumb-link-item';
import type { NavigationLocale } from '../../../i18n/navigation';

type BreadcrumbTrailItemProps = { item: BreadcrumbItem; locale: NavigationLocale };

export function BreadcrumbTrailItem(props: BreadcrumbTrailItemProps) {
  if (props.item.href) {
    return <BreadcrumbLinkItem item={props.item} locale={props.locale} />;
  }
  return <BreadcrumbCurrentItem item={props.item} />;
}
