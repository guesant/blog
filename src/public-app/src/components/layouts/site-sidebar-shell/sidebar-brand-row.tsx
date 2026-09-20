import { Box } from '../../ui';
import { SidebarBackButton } from './sidebar-back-button';
import { SidebarBrandLink } from './sidebar-brand-link';

type SidebarBrandRowProps = { backHref?: string; backLabel: string };

export function SidebarBrandRow(props: SidebarBrandRowProps) {
  return (
    <Box visualVariant="sidebarBrandRow">
      {props.backHref && <SidebarBackButton href={props.backHref} label={props.backLabel} />}
      <SidebarBrandLink />
    </Box>
  );
}
