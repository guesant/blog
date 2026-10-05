'use client';

import type { ReactNode } from 'react';
import type { SiteText } from '@portfolio/data/domain/types';
import { SiteNavigationContext, type SiteNavigation } from './site-navigation-context';

type SiteNavigationProviderProps = {
  value: SiteText['navigation'];
  children: ReactNode;
};

export function SiteNavigationProvider(props: SiteNavigationProviderProps) {
  const navigation: SiteNavigation = props.value ?? {
    sidebar: [],
    footerLinks: [],
    sitemap: [],
  };

  return (
    <SiteNavigationContext.Provider value={navigation}>
      {props.children}
    </SiteNavigationContext.Provider>
  );
}
