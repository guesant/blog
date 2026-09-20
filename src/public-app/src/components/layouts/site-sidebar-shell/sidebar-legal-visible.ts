import type { SiteVisibility } from '@portfolio/data/domain/types';

type SidebarLegalVisibleProps = {
  visibility: SiteVisibility | undefined;
  showContact: boolean;
};

export function sidebarLegalVisible(props: SidebarLegalVisibleProps): boolean {
  return Boolean(props.visibility?.license || props.visibility?.credits || props.showContact);
}
