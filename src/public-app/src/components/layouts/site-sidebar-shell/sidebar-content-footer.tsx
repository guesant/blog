import { SidebarContentFooterFrame } from '../../ui';

type SidebarContentFooterProps = { copyright: string };

export function SidebarContentFooter(props: SidebarContentFooterProps) {
  return <SidebarContentFooterFrame>{props.copyright}</SidebarContentFooterFrame>;
}
