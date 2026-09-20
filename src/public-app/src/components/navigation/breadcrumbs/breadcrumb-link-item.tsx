import { Button } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';
import type { BreadcrumbItem } from './types';

type BreadcrumbLinkItemProps = { item: BreadcrumbItem };

export function BreadcrumbLinkItem(props: BreadcrumbLinkItemProps) {
  return (
    <Button component={LocaleLink} href={props.item.href ?? '/'} siteVariant="breadcrumb">
      {props.item.label}
    </Button>
  );
}
