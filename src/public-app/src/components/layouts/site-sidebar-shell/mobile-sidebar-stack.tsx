import { Stack } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';
import type { SidebarLayoutProps } from './sidebar-layout.types';
import { SidebarPreferences } from './sidebar-preferences';

type MobileSidebarStackProps = SidebarLayoutProps & {
  showRight: boolean;
  onClose: () => void;
};

export function MobileSidebarStack(props: MobileSidebarStackProps) {
  const t = useTranslations('Sidebar');

  return (
    <Stack visualVariant="mobileSidebarStack">
      <LeftSidebar
        site={props.site}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onClose}
        showPreferences={false}
      />
      {props.showRight && <RightSidebar {...props} onNavigate={props.onClose} />}
      <SidebarPreferences pathname={props.pathname} locale={props.locale} t={t} />
    </Stack>
  );
}
