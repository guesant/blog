import { Box } from '../../ui';
import { SidebarPreferences } from './sidebar-preferences';

type LeftSidebarPreferencesAreaProps = {
  pathname: string;
  locale: string;
  t: (key: string) => string;
};

export function LeftSidebarPreferencesArea(props: LeftSidebarPreferencesAreaProps) {
  return (
    <Box visualVariant="leftSidebar">
      <SidebarPreferences pathname={props.pathname} locale={props.locale} t={props.t} />
    </Box>
  );
}
