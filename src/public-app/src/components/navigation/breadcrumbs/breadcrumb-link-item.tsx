import { localizedPath, type NavigationLocale } from '../../../i18n/navigation';
import type { BreadcrumbItem } from './types';
import { BreadcrumbButton } from '../../ui/semantic/BreadcrumbButton';

type BreadcrumbLinkItemProps = { item: BreadcrumbItem; locale: NavigationLocale };

export function BreadcrumbLinkItem(props: BreadcrumbLinkItemProps) {
  return (
    <BreadcrumbButton component="a" href={localizedPath(props.item.href ?? '/', props.locale)}>
      {props.item.label}
    </BreadcrumbButton>
  );
}
