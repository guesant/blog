'use client';

import { useTranslations } from '@/i18n/compat';
import type { SiteText } from '@portfolio/data/domain/types';
import { buildLeftSidebarBackNavigation } from './build-left-sidebar-back-navigation';
import { buildLeftSidebarData } from './build-left-sidebar-data';
import { internalRoute } from './internal-route';
import { LeftSidebarShellView } from './left-sidebar-shell-view';

type LeftSidebarProps = {
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
  showPreferences?: boolean;
};

export function LeftSidebar(props: LeftSidebarProps) {
  const t = useTranslations('Sidebar');

  const tNav = useTranslations('Nav');

  const currentPathname = internalRoute(props.pathname, props.locale);

  const data = buildLeftSidebarData({ site: props.site, currentPathname, tNav });

  const back = buildLeftSidebarBackNavigation({ pathname: currentPathname, tNav });

  return (
    <LeftSidebarShellView
      site={props.site}
      locale={props.locale}
      onNavigate={props.onNavigate}
      showPreferences={props.showPreferences ?? true}
      t={t}
      data={data}
      back={back}
    />
  );
}
