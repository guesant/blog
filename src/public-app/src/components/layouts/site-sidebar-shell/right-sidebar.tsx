'use client';

import { useTranslations } from '@/i18n/compat';
import type { Profile, SiteText } from '@portfolio/data/domain/types';
import { buildRightSidebarData } from './build-right-sidebar-data';
import { RightSidebarView } from './right-sidebar-view';

type RightSidebarProps = {
  site: SiteText;
  profile: Profile;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
};

export function RightSidebar(props: RightSidebarProps) {
  const t = useTranslations('Sidebar');

  const data = buildRightSidebarData({ site: props.site, locale: props.locale, t });

  return (
    <RightSidebarView
      site={props.site}
      pathname={props.pathname}
      locale={props.locale}
      onNavigate={props.onNavigate}
      t={t}
      data={data}
    />
  );
}
