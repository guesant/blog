import {
  SidebarMobileBackButtonFrame,
  SidebarMobileBrandHeaderFrame,
  SidebarMobileStackFrame,
} from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { SidebarBackButton } from './sidebar-back-button';
import { SidebarBrandLink } from './sidebar-brand-link';
import { buildLeftSidebarBackNavigation } from './build-left-sidebar-back-navigation';
import { internalRoute } from './internal-route';
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

  const tNav = useTranslations('Nav');

  const currentPathname = internalRoute(props.pathname, props.locale);

  const back = buildLeftSidebarBackNavigation({ pathname: currentPathname, tNav });

  const backHref = back.backHref ?? '';

  return (
    <SidebarMobileStackFrame>
      <SidebarMobileBrandHeaderFrame>
        <ConditionalContent
          condition={Boolean(back.backHref)}
          content={
            <SidebarMobileBackButtonFrame>
              <SidebarBackButton href={backHref} label={back.backLabel} />
            </SidebarMobileBackButtonFrame>
          }
        />
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
