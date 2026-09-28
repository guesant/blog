'use client';

import { Icon } from '../../primitives/icon';
import { SidebarBackButtonFrame } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';

type SidebarBackButtonProps = { href: string; label: string };

export function SidebarBackButton(props: SidebarBackButtonProps) {
  return (
    <SidebarBackButtonFrame component={LocaleLink} href={props.href} label={props.label}>
      <Icon name="arrow-left" size={15} />
    </SidebarBackButtonFrame>
  );
}
