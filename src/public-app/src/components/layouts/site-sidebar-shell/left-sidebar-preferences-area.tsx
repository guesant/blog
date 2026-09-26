import { Box } from '../../ui';
import { SidebarPreferences } from './sidebar-preferences';
import type { SidebarTranslator } from '@/i18n/compat-support';

type LeftSidebarPreferencesAreaProps = {
  pathname: string;
  locale: string;
  t: SidebarTranslator;
};

export function LeftSidebarPreferencesArea(props: LeftSidebarPreferencesAreaProps) {
  return (
    <Box visualVariant="leftSidebar">
      <SidebarPreferences pathname={props.pathname} locale={props.locale} t={props.t} />
    </Box>
  );
}
