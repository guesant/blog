import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { LeftSidebarMainNavigation } from './left-sidebar-main-navigation';
import { LeftSidebarPreferencesArea } from './left-sidebar-preferences-area';
import type { SiteText } from '@portfolio/data/domain/types';
import type { buildLeftSidebarBackNavigation } from './build-left-sidebar-back-navigation';
import type { buildLeftSidebarData } from './build-left-sidebar-data';
import type { SidebarTranslator } from '@/i18n/compat-support';

type LeftSidebarShellViewProps = {
  site: SiteText;
  locale: string;
  onNavigate?: () => void;
  showPreferences: boolean;
  t: SidebarTranslator;
  data: ReturnType<typeof buildLeftSidebarData>;
  back: ReturnType<typeof buildLeftSidebarBackNavigation>;
};

export function LeftSidebarShellView(props: LeftSidebarShellViewProps) {
  return (
    <Box
      component="nav"
      aria-label={props.t('navigation')}
      visualVariant={props.showPreferences ? 'sidebarNav' : 'sidebarNavCompact'}
    >
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
        compact={!props.showPreferences}
      />
      <ConditionalContent
        condition={props.showPreferences}
        content={
          <LeftSidebarPreferencesArea
            pathname={props.data.currentPathname}
            locale={props.locale}
            t={props.t}
          />
        }
      />
    </Box>
  );
}
