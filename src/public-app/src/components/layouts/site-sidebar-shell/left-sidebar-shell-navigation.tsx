import { LeftSidebarMainNavigation } from './left-sidebar-main-navigation';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildLeftSidebarBackNavigation } from './build-left-sidebar-back-navigation';
import type { buildLeftSidebarData } from './build-left-sidebar-data';
import type { SidebarTranslator } from '@/i18n/compat-support';

type LeftSidebarShellNavigationProps = {
  site: SiteText;
  locale: string;
  onNavigate?: () => void;
  t: SidebarTranslator;
  data: ReturnType<typeof buildLeftSidebarData>;
  back: ReturnType<typeof buildLeftSidebarBackNavigation>;
  compact: boolean;
  showBrand?: boolean;
};

export function LeftSidebarShellNavigation(props: LeftSidebarShellNavigationProps) {
  return (
    <LeftSidebarMainNavigation
      backHref={props.back.backHref}
      backLabel={props.back.backLabel}
      homeItem={props.data.homeItem}
      contentGroups={props.data.contentGroups}
      aboutVisible={props.data.aboutVisible}
      aboutItem={props.data.aboutItem}
      groupLabel={props.data.contentGroupLabel}
      t={props.t}
      pathname={props.data.currentPathname}
      locale={props.locale}
      site={props.site}
      onNavigate={props.onNavigate}
      compact={props.compact}
      showBrand={props.showBrand}
    />
  );
}
