import type { NavigationItem, SiteVisibility } from '@portfolio/data/domain/types';
import type { SidebarTranslator } from '@/i18n/compat-support';
import { buildSidebarLegalItem } from './build-sidebar-legal-item';
import { sidebarVisibilityEnabled } from './sidebar-visibility-enabled';

type BuildSidebarLegalItemsProps = {
  visibility: SiteVisibility | undefined;
  showContact: boolean;
  t: SidebarTranslator;
};

export function buildSidebarLegalItems(props: BuildSidebarLegalItemsProps): NavigationItem[] {
  return [
    buildSidebarLegalItem({
      visible: sidebarVisibilityEnabled(props.visibility, 'license'),
      route: '/license',
      label: props.t('license'),
    }),
    buildSidebarLegalItem({
      visible: sidebarVisibilityEnabled(props.visibility, 'credits'),
      route: '/credits',
      label: props.t('credits'),
    }),
    buildSidebarLegalItem({
      visible: props.showContact,
      route: '/contact',
      label: props.t('reportIssue'),
    }),
  ].filter((item): item is NavigationItem => item !== undefined);
}
