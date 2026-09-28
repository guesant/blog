import { SidebarPreferencesFrame } from '../../ui';
import { SidebarPreferences } from './sidebar-preferences';
import type { SidebarTranslator } from '@/i18n/compat-support';

type LeftSidebarPreferencesAreaProps = {
  pathname: string;
  locale: string;
  t: SidebarTranslator;
};

export function LeftSidebarPreferencesArea(props: LeftSidebarPreferencesAreaProps) {
  return (
    <SidebarPreferencesFrame>
      <SidebarPreferences pathname={props.pathname} locale={props.locale} t={props.t} />
    </SidebarPreferencesFrame>
  );
}
