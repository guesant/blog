import { Box } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { MobileNavigationButton } from './mobile-navigation-button';
import { SidebarBrandLink } from './sidebar-brand-link';

type MobileSidebarTopbarProps = {
  onOpen: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function MobileSidebarTopbar(props: MobileSidebarTopbarProps) {
  return (
    <Box visualVariant="mobileSidebarTopbar">
      <SidebarBrandLink />
      <MobileNavigationButton onOpen={props.onOpen} t={props.t} />
    </Box>
  );
}
