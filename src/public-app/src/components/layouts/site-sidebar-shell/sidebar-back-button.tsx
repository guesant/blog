'use client';

import { Icon } from '../../primitives/icon';
import { IconButton } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';

type SidebarBackButtonProps = { href: string; label: string };

export function SidebarBackButton(props: SidebarBackButtonProps) {
  return (
    <IconButton
      component={LocaleLink}
      href={props.href}
      aria-label={props.label}
      size="small"
      visualVariant="sidebarBackButton"
    >
      <Icon name="arrow-left" size={15} />
    </IconButton>
  );
}
