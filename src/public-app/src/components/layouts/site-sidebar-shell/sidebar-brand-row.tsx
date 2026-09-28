import { SidebarBrandRowFrame } from '../../ui';
import { SidebarBackButton } from './sidebar-back-button';
import { SidebarBrandLink } from './sidebar-brand-link';

type SidebarBrandRowProps = { backHref?: string; backLabel: string };

export function SidebarBrandRow(props: SidebarBrandRowProps) {
  return (
    <SidebarBrandRowFrame>
      {props.backHref && <SidebarBackButton href={props.backHref} label={props.backLabel} />}
      <SidebarBrandLink />
    </SidebarBrandRowFrame>
  );
}
