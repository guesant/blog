import { Button } from '../../ui';
import { localizedPath, type NavigationLocale } from '../../../i18n/navigation';
import type { BreadcrumbItem } from './types';

type BreadcrumbLinkItemProps = { item: BreadcrumbItem; locale: NavigationLocale };

export function BreadcrumbLinkItem(props: BreadcrumbLinkItemProps) {
  return (
    <Button
      component="a"
      href={localizedPath(props.item.href ?? '/', props.locale)}
      siteVariant="breadcrumb"
    >
      {props.item.label}
    </Button>
  );
}
