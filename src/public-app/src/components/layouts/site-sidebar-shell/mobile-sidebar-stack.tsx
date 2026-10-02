import { SidebarMobileBrandHeaderFrame, SidebarMobileStackFrame } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { SidebarBrandLink } from './sidebar-brand-link';
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
    <SidebarMobileStackFrame>
      <SidebarMobileBrandHeaderFrame>
        <SidebarBrandLink />
      </SidebarMobileBrandHeaderFrame>
      <LeftSidebar
        site={props.site}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onClose}
        showPreferences={false}
        showBrand={false}
      />
      <ConditionalContent
        condition={props.showRight}
        content={<RightSidebar {...props} onNavigate={props.onClose} mobile />}
      />
      <SidebarPreferences pathname={props.pathname} locale={props.locale} t={t} />
    </SidebarMobileStackFrame>
  );
}
