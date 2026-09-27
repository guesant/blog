import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { LeftSidebarShellNavigation } from './left-sidebar-shell-navigation';
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
  showBrand?: boolean;
};

export function LeftSidebarShellView(props: LeftSidebarShellViewProps) {
  return (
    <Box
      component="nav"
      aria-label={props.t('navigation')}
      visualVariant={props.showPreferences ? 'sidebarNav' : 'sidebarNavCompact'}
    >
      <LeftSidebarShellNavigation
        site={props.site}
        locale={props.locale}
        onNavigate={props.onNavigate}
        t={props.t}
        data={props.data}
        back={props.back}
        compact={!props.showPreferences}
        showBrand={props.showBrand}
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
